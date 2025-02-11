FROM debian:bookworm
LABEL org.opencontainers.image.source=https://github.com/spaceness/stardust
WORKDIR /opt/stardust
ENV USER=stardust
ENV PNPM_HOME="/home/stardust/.local/share/pnpm"
ENV DEBIAN_FRONTEND=noninteractive

COPY ./shared /opt/stardust/shared

RUN apt-get update && apt-get install --no-install-recommends -y \
  xfonts-75dpi xvfb passwd sudo dbus dbus-x11 libxrandr2 libxext-dev libxrender-dev libxtst-dev imagemagick x11-apps build-essential pulseaudio gstreamer1.0* fonts-noto-color-emoji \
  python3 python3-pip xterm git procps python3-numpy xfwm4 xfce4-terminal xfce4-session xfconf xfce4-notifyd wget curl inetutils-ping vim tigervnc-tools tigervnc-standalone-server tigervnc-common \
  gstreamer1.0-plugins-good gstreamer1.0-plugins-bad gstreamer1.0-plugins-ugly

RUN bash /opt/stardust/shared/prepare.sh
USER stardust
RUN bash /opt/stardust/shared/vnc-setup.sh

WORKDIR /home/stardust
EXPOSE 5901 4713 6080
CMD ["bash", "/opt/stardust/shared/start.sh"]
