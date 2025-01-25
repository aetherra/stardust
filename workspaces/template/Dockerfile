FROM debian:bookworm
LABEL org.opencontainers.image.source=https://github.com/spaceness/stardust
WORKDIR /opt/stardust
ENV USER=stardust
ENV PNPM_HOME="/home/stardust/.local/share/pnpm"
ENV DEBIAN_FRONTEND=noninteractive

COPY ./scripts /opt/stardust/scripts
# idk if all of these are needed someone fix this - @incognitotgt
RUN apt-get update && apt-get install --no-install-recommends -y \
  xfonts-75dpi xvfb passwd sudo dbus dbus-x11 libxrandr2 libxext-dev libxrender-dev libxtst-dev imagemagick x11-apps build-essential pulseaudio gstreamer1.0* \
  python3 python3-pip xterm git procps python3-numpy xfwm4 xfce4-terminal xfce4-session xfconf xfce4-notifyd \
  wget curl inetutils-ping vim tigervnc-tools tigervnc-standalone-server tigervnc-common \
  {{APPLICATION_PACKAGE}}

RUN bash /opt/stardust/scripts/prepare.sh
USER stardust
COPY ./{{NAME}}/xstartup /opt/stardust/xstartup
RUN bash /opt/stardust/scripts/vnc-setup.sh

WORKDIR /home/stardust
CMD ["bash", "/opt/stardust/scripts/start.sh"]
EXPOSE 5901 4713 6080
