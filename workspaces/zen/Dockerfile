FROM ghcr.io/aetherra/debian-base AS base
USER root
COPY ./zen/install.sh /opt/stardust/scripts/zen-install.sh
RUN bash /opt/stardust/scripts/zen-install.sh
COPY ./zen/xstartup /home/stardust/.vnc/xstartup
RUN chmod +x /home/stardust/.vnc/xstartup
USER stardust
