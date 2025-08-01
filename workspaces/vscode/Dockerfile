# broken currently
FROM ghcr.io/aetherra/debian-base AS base
USER root
COPY ./vscode/install.sh /opt/stardust/scripts/vscode-install.sh
RUN bash /opt/stardust/scripts/vscode-install.sh
COPY ./vscode/xstartup /home/stardust/.vnc/xstartup
RUN chmod +x /home/stardust/.vnc/xstartup
USER stardust
