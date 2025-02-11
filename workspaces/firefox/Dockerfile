FROM ghcr.io/spaceness/debian-base as base
RUN sudo apt-get update \
  && sudo apt-get install --no-install-recommends -y firefox-esr
USER stardust
COPY ./firefox/xstartup /home/stardust/.vnc/xstartup
RUN sudo chmod +x /home/stardust/.vnc/xstartup
