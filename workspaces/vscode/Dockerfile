# broken currently
FROM ghcr.io/spaceness/debian-base as base
USER root
COPY ./vscode/install.sh /opt/stardust/scripts/vscode-install.sh
USER stardust
RUN bash /opt/stardust/scripts/vscode-install.sh
COPY ./vscode/xstartup /home/stardust/.vnc/xstartup
RUN sudo chmod +x /home/stardust/.vnc/xstartup
