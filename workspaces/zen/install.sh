#!/bin/bash

app_name=zen
literal_name_of_installation_directory=".tarball-installations"
universal_path_for_installation_directory="/home/stardust/$literal_name_of_installation_directory"
app_installation_directory="$universal_path_for_installation_directory/zen"
official_package_location="https://github.com/zen-browser/desktop/releases/latest/download/zen.linux-$(uname -m).tar.xz"
tar_location=$(mktemp /tmp/zen.XXXXXX.tar.xz)
open_tar_application_data_location="zen"
local_bin_path="/home/stardust/.local/bin"
local_application_path="/home/stardust/.local/share/applications"
app_bin_in_local_bin="$local_bin_path/$app_name"
desktop_in_local_applications="$local_application_path/$app_name.desktop"
icon_path="$app_installation_directory/browser/chrome/icons/default/default128.png"
executable_path=$app_installation_directory/zen

echo "Welcome to Zen tarball installer, just chill and wait for the installation to complete!"

sleep 1

echo "Checking to see if an older installation exists"
if [ -f "$app_bin_in_local_bin" ]; then
  echo "Old bin file detected, removing..."
  rm "$app_bin_in_local_bin"
fi

if [ -d "$app_installation_directory" ]; then
  echo "Old app files are found, removing..."
  rm -rf "$app_installation_directory"
fi

if [ -f "$desktop_in_local_applications" ]; then
  echo "Old app files are found, removing..."
  rm "$desktop_in_local_applications"
fi

echo "Installing the latest package"
curl -L -o $tar_location $official_package_location
if [ $? -eq 0 ]; then
  echo OK
else
  echo "Installation failed. Curl not found or not installed"
  exit
fi

tar -xvJf $tar_location

echo "Installed and untarred successfully"

if [ ! -d $universal_path_for_installation_directory ]; then
  echo "Creating the $universal_path_for_installation_directory directory for installation"
  mkdir -p $universal_path_for_installation_directory
fi

mv $open_tar_application_data_location $app_installation_directory

echo "Zen successfully moved to your safe place!"

rm $tar_location

if [ ! -d $local_bin_path ]; then
  echo "$local_bin_path not found, creating it for you"
  mkdir -p $local_bin_path
fi

touch $app_bin_in_local_bin
chmod u+x $app_bin_in_local_bin
echo "#!/bin/bash
$executable_path" >> $app_bin_in_local_bin

echo "Created executable for your \$PATH if you ever need"

if [ ! -d $local_application_path ]; then
  echo "Creating the $local_application_path directory for desktop file"
  mkdir -p $local_application_path
fi

echo "Installation is successful"
echo "Done, and done, have fun! 🐷"
