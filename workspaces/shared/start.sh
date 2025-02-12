#!/bin/bash
sudo chmod +x /home/stardust/.vnc/xstartup
PASS=$VNCPASSWORD
echo $VNCPASSWORD | vncpasswd -f > /home/stardust/.vnc/passwd
if [[ "$WIPEVNCENV" == "true" ]]; then
  unset VNCPASSWORD
  unset WIPEVNCENV
fi
vncserver -kill :1
sudo rm -rf /run/dbus
sudo mkdir -p /run/dbus
sleep 1
# files
echo "while :
do
node /opt/stardust/shared/files.mjs --pass $PASS
sleep 5
done
" | bash &
unset pass
# audio server
echo "while :
do
/opt/stardust/tcpulse 0.0.0.0 4713
sleep 5
done
" | bash &
# vnc
echo "while :
do
vncserver :1 -passwd /home/stardust/.vnc/passwd -fg -localhost no
sleep 5
done
" | bash &
# wallpaper
xfconf-query -c xfce4-desktop -p /backdrop/screen0/monitorVNC-0/workspace0/last-image -s /opt/stardust/wallpaper.png
