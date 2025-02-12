FROM ghcr.io/spaceness/debian-base AS base
RUN sudo apt-get update \
  && sudo apt-get install --no-install-recommends -y \
    x11vnc \
    wmctrl \
    chromium
USER stardust
COPY ./chromium/xstartup /home/stardust/.vnc/xstartup
RUN sudo chmod +x /home/stardust/.vnc/xstartup
