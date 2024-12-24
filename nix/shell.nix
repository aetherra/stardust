{
  perSystem =
    {
      lib,
      pkgs,
      self',
      config,
      inputs',
      ...
    }:
    {
      devShells = {
        default = pkgs.mkShell {
          name = "stardust";
          packages = [
            pkgs.nodejs_latest
            pkgs.nodePackages_latest.pnpm # PNPM package manager
            pkgs.postgresql_16
            pkgs.libpqxx
            pkgs.jq
          ];

          inputsFrom = [ config.treefmt.build.devShell ];
        };
      };
    };
}
