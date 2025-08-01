FROM ghcr.io/aetherra/debian-base AS base
USER root
RUN apt-get update \
  && apt-get install --no-install-recommends -y chromium
COPY ./chromium/xstartup /home/stardust/.vnc/xstartup
RUN chmod +x /home/stardust/.vnc/xstartup
USER stardust
