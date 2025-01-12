FROM debian:latest
LABEL org.opencontainers.image.source=https://github.com/spaceness/stardust
ENV USER=stardust
ENV PNPM_HOME="/home/stardust/.local/share/pnpm"
ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /app
RUN apt-get update && apt-get install --no-install-recommends -y \
    xfonts-75dpi xvfb passwd sudo dbus dbus-x11 libxrandr2 libxext-dev libxrender-dev libxtst-dev \
    python3 python3-pip xterm procps python3-numpy xfwm4 xfce4-terminal xfce4-session xfconf xfce4-notifyd \
    wget curl inetutils-ping imagemagick vim tigervnc-tools tigervnc-standalone-server tigervnc-common \
    chromium && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*
RUN useradd --uid 1000 stardust && \
    mkdir -p /run/dbus /home/stardust /home/stardust/.vnc && \
    chown -R stardust:stardust /home/stardust && \
    chmod 777 /home/stardust /app && \
    echo "stardust ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers && \
    usermod -aG sudo stardust
USER stardust
RUN touch /home/stardust/.Xresources /home/stardust/.Xauthority
COPY ./scripts/start.sh ./start.sh
COPY ./chromium/xstartup /home/stardust/.vnc/xstartup
RUN sudo chmod +x /home/stardust/.vnc/xstartup
CMD ["bash", "start.sh"]
EXPOSE 5901
