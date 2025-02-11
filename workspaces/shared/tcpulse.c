// https://coredump.ws/index.php?dir=code&post=NoVNC_with_audio
#include <arpa/ftp.h>
#include <arpa/inet.h>
#include <arpa/telnet.h>
#include <err.h>
#include <errno.h>
#include <netdb.h>
#include <netinet/in.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/file.h>
#include <sys/ioctl.h>
#include <sys/param.h>
#include <sys/select.h>
#include <sys/socket.h>
#include <sys/time.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <unistd.h>

// amount of milliseconds to wait in between send/recv attempts
#define GRACE_TIME 20
// send/recv buffer size
#define BUF_SIZE 4096
// the command we need to pipe to our socket
#define COMMAND                                                                \
  "gst-launch-1.0 -q -v pulsesrc buffer-time=20000 latency-time=5000 ! "       \
  "audio/x-raw, channels=2, rate=48000 ! audioconvert ! "                      \
  "voaacenc bitrate=192000 ! mp4mux streamable=true fragment_duration=100 ! "  \
  "fdsink "                                                                    \
  "fd=1"

// little helper macro
#define max(a, b) (a > b ? a : b)

// sets the non-blocking flag for an IO descriptor
void set_nonblock(int fd) {
  // retrieve all the flags for this file descriptor
  int fl = fcntl(fd, F_GETFL, 0);

  if (fl < 0) {
    fprintf(stderr, "Failed to get flags for file descriptor %d: %s\n", fd,
            strerror(errno));
    exit(1);
  }

  // add the non-blocking flag to this file descriptor's flags
  if (fcntl(fd, F_SETFL, fl | O_NONBLOCK) < 0) {
    fprintf(stderr, "Failed to set flags for file descriptor %d: %s\n", fd,
            strerror(errno));
    exit(1);
  }
}

int create_server_sock(char *addr, int port) {
  int on = 1;
  static struct sockaddr_in client_addr;

  int sock = socket(AF_INET, SOCK_STREAM, 0);
  if (sock < 0) {
    fprintf(stderr, "Failed to create server socket.\n");
    return -1;
  }

  memset(&client_addr, '\0', sizeof(client_addr));

  client_addr.sin_family = AF_INET;
  client_addr.sin_addr.s_addr = inet_addr(addr);
  client_addr.sin_port = htons(port);

  if (setsockopt(sock, SOL_SOCKET, SO_REUSEADDR, &on, 4) < 0) {
    fprintf(stderr, "Failed to set socket address %s:%d\n", addr, port);
    return -1;
  }

  if (bind(sock, (struct sockaddr *)&client_addr, sizeof(client_addr)) < 0) {
    fprintf(stderr, "Failed to bind server socket on %s:%d\n", addr, port);
    return -1;
  }

  if (listen(sock, 5) < 0) {
    fprintf(stderr, "Failed to listen on %s:%d\n", addr, port);
    return -1;
  }

  fprintf(stdout, "Listening on %s port %d\n", addr, port);

  return sock;
}

int wait_for_client(int s) {
  struct sockaddr_in peer;
  socklen_t len = sizeof(struct sockaddr);
  fprintf(stdout, "Accepting connections with file descriptor: %d\n", s);

  int newsock = accept(s, (struct sockaddr *)&peer, &len);

  if (newsock < 0 && errno != EINTR) {
    fprintf(stdout, "Failed to accept connection with file descriptor %d: %s\n",
            s, strerror(errno));
    return -1;
  }

  struct hostent *hostinfo =
      gethostbyaddr((char *)&peer.sin_addr.s_addr, len, AF_INET);
  fprintf(stdout, "Incoming connection accepted from %s[%s]\n",
          !hostinfo ? "" : hostinfo->h_name, inet_ntoa(peer.sin_addr));

  set_nonblock(newsock);
  return (newsock);
}

void pipe_to_socket(int outputSocket, int sourceSocket) {
  char sbuf[BUF_SIZE];
  char dummy[BUF_SIZE];
  int sendCount = 0;
  struct timeval to = {0, 100};

  for (;;) {
    // if we've read data from our cmmand we need to send it
    if (sendCount) {
      int sent = write(outputSocket, sbuf, sendCount);

      // if an error happens during sending - the client probably gave up
      if (sent < 0 && errno != EWOULDBLOCK) {
        fprintf(stdout, "client disconnected: %s\n", strerror(errno));
        exit(1);
      }

      // reduce our buffer by the amount of data sent
      if (sent != sendCount)
        memmove(sbuf, sbuf + sent, sendCount - sent);
      sendCount -= sent;
    }

    // use select to wait until anything happens to our source file.
    fd_set R;
    FD_ZERO(&R);
    FD_SET(sourceSocket, &R);
    int selectValue =
        select(max(outputSocket, sourceSocket) + 1, &R, 0, 0, &to);

    if (selectValue > 0) {
      read(outputSocket, dummy,
           BUF_SIZE); // read potential input from the client - and discard it.

      // read our input stream into the buffer that's to be transferred to the
      // client
      int readCount =
          read(sourceSocket, sbuf + sendCount, BUF_SIZE - sendCount);

      // if our program closed - end the session
      if (readCount < 0 && errno != EWOULDBLOCK) {
        fprintf(stdout, "command stopped : %s\n", strerror(errno));
        exit(1);
      }

      // add the amount of data to the buffer that we have to send
      if (readCount > 0)
        sendCount += readCount;
    }

    // if our client disconnected for any reason
    if (selectValue < 0 && errno != EINTR) {
      fprintf(stdout, "client disconnected: %s\n", strerror(errno));
      close(sourceSocket);
      close(outputSocket);
      _exit(0);
    }

    usleep(GRACE_TIME);
  }
}

int main(int argc, char *argv[]) {
  char *localaddr = NULL;
  int localport = -1;
  int client = -1;
  int server = -1;
  int server_socket = -1;

  if (3 != argc) {
    fprintf(stderr, "usage: %s laddr lport\n", argv[0]);
    exit(1);
  }

  server_socket = create_server_sock(argv[1], atoi(argv[2]));

  for (;;) {
    if ((client = wait_for_client(server_socket)) < 0)
      continue;
    system("pulseaudio -D");
    FILE *pipeFile = popen(COMMAND, "r");

    if (pipeFile <= 0) {
      fprintf(stderr, "Failed to open pipe for command\n");
      close(client);
      client = -1;
      continue;
    }

    if ((server = fileno(pipeFile)) < 0) {
      close(client);
      client = -1;
      continue;
    }

    set_nonblock(server);

    if (0 == fork()) {
      close(server_socket);
      pipe_to_socket(client, server);
      abort();
    }

    close(client);
    client = -1;

    close(server);
    server = -1;
  }
}
