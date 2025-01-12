#!/bin/bash
mkdir -p /home/stardust/.vnc
touch /home/stardust/.Xresources /home/stardust/.Xauthority
sudo chmod +x /home/stardust/.vnc/xstartup
git clone https://github.com/spaceness/starlight /opt/stardust/starlight
cd /opt/stardust/starlight
sudo npm i -g pnpm
pnpm i
