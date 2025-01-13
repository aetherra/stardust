#!/bin/bash
mkdir -p /home/stardust/.vnc
touch /home/stardust/.Xresources /home/stardust/.Xauthority
sudo chmod +x /home/stardust/.vnc/xstartup
sudo npm i -g pnpm
sudo git clone https://github.com/spaceness/starlight /opt/stardust/starlight
cd /opt/stardust/starlight
sudo pnpm install -C /opt/stardust/starlight
