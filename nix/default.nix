{
  imports = [
    ./args.nix # add pkgs argument so we can import pkgs from anywhere
    ./systems.nix # system architectures
    ./formatter.nix # code formatter
    ./shell.nix # dev shells
  ];
}
