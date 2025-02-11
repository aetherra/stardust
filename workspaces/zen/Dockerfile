FROM ghcr.io/spaceness/debian-base as base
COPY ./zen/install.sh /opt/stardust/scripts/zen-install.sh
USER stardust
RUN bash /opt/stardust/scripts/zen-install.sh
COPY ./zen/xstartup /home/stardust/.vnc/xstartup
RUN sudo chmod +x /home/stardust/.vnc/xstartup
