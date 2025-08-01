#!/bin/bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
  && apt-get install -y nodejs \
  && apt-get clean && rm -rf /var/lib/apt/lists/*
mkdir -p /run/dbus
useradd --uid 1000 stardust
mkdir -p /home/stardust
chown stardust /home/stardust
chmod 777 /home/stardust
chmod 777 /opt/stardust
gcc -o /opt/stardust/tcpulse /opt/stardust/shared/tcpulse.c
