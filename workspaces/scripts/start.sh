#!/bin/bash
sudo chmod +x /home/stardust/.vnc/xstartup
echo $VNCPASSWORD | vncpasswd -f > /home/stardust/.vnc/passwd
if [[ "$WIPEVNCENV" == "true" ]]; then
    unset VNCPASSWORD
    unset WIPEVNCENV
fi
vncserver -kill :1
sudo rm -rf /run/dbus
sudo mkdir -p /run/dbus
sleep 1
echo "while :
do
vncserver :1 -passwd /home/stardust/.vnc/passwd -fg -localhost no
sleep 5
done
" | bash
