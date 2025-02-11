#!/bin/bash
set -euo pipefail
download_url="https://code.visualstudio.com/sha/download?build=stable&os=linux-$(dpkg-architecture -q DEB_BUILD_ARCH)"
echo "Installing VSCode..."
echo "Downloading"
echo $download_url
curl -fSL $download_url -o /tmp/vscode.tar.gz
echo "Extracting"
mkdir -p /home/stardust/.local/share/vscode
tar --strip-components=1 -xzf /tmp/vscode.tar.gz -C /home/stardust/.local/share/vscode
echo "Success!"
