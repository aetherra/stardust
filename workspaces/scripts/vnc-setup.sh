#!/bin/bash
mkdir -p /home/stardust/.vnc
touch /home/stardust/.Xresources /home/stardust/.Xauthority
cp /opt/stardust/xstartup /home/stardust/.vnc/xstartup
sudo chmod +x /home/stardust/.vnc/xstartup
