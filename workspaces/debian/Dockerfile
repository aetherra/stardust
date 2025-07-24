FROM ghcr.io/spaceness/debian-base AS base
USER root
RUN apt-get update && apt-get install --no-install-recommends -y \
  neofetch \
  xfce4 xfce4-goodies \
  firefox-esr chromium gimp \
  remmina remmina-plugin-vnc remmina-plugin-rdp \
  flatpak \
  wmctrl \
  && rm -rf /var/lib/apt/lists/*
COPY ./debian/xstartup /home/stardust/.vnc/xstartup
RUN chmod +x /home/stardust/.vnc/xstartup
USER stardust
