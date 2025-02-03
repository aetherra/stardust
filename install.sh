#!/usr/bin/env sh


darwin_check() {
    if [[ $OSTYPE != "linux-gnu"* ]]; then
        echo "✨ Stardust: Only linux support on the installer for now"
        exit
    fi
}

root_check() {
    if [[ $(id -u) != 0 ]]; then
        echo "✨ Stardust: Please run as root."
        exit
    fi
}

install_st() {
    local install_path=$1
    mkdir -p $install_path
    if [[ $(basename $PWD) != 'stardust' ]]; then
        echo "✨ Stardust: Please run from the root of the stardust repository."
        exit
    fi
    echo "✨ Stardust: Installing..."
    cp -R ./* $install_path/
    echo "✨ Stardust: Installed successfully!"
}

install_service() {
    echo "✨ Stardust: Installing systemd service"
    cp ./apps/daemon/src/stardustd.service /etc/systemd/system/
    systemctl daemon-reload > /dev/null
}

prompts() {
    read -p "✨ Install directory [/opt/stardust]: " install_path
    read -p "✨ Make a systemd service? [Y/n]: " systemd
    install_path=${install_path:-/opt/stardust}
    systemd=${systemd:-Y}
    install_st $install_path
    if [[ $systemd == "Y" ]]; then
        install_service
        read -p "✨ Start the Stardust service now? [Y/n]: " now
        now=${now:-Y}
        if [ $now == "Y" ]; then
            systemctl enable stardustd --now
        fi
    else
        touch $install_path/apps/daemon/NOSERVICE
    fi
}

main() {
    echo "✨ Welcome to Stardust by spaceness"
    root_check
    darwin_check
    prompts
}

main
