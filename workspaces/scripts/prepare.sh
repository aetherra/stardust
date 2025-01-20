#!/bin/bash
mkdir -p /run/dbus
useradd --uid 1000 stardust
mkdir -p /home/stardust
chown stardust /home/stardust
chmod 777 /home/stardust
chmod 777 /opt/stardust
echo "stardust ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers
usermod -aG sudo stardust
gcc -o /opt/stardust/tcpulse /opt/stardust/scripts/tcpulse.c
