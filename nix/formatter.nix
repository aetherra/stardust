{ inputs, ... }:
{
  imports = [ inputs.treefmt-nix.flakeModule ];

  perSystem =
    { pkgs, config, ... }:
    {
      formatter = config.treefmt.build.wrapper;

      treefmt = {
        projectRootFile = "flake.nix";

        programs = {
          shellcheck.enable = true;
          taplo.enable = true;

          nixfmt = {
            enable = true;
            package = pkgs.nixfmt-rfc-style;
          };

          biome = {
            enable = true;
            settings =
              let
                ignore = [
                  ".next"
                  "node_modules"
                  "public/files/*"
                ];
              in
              {
                organizeImports = {
                  enabled = true;
                  inherit ignore;
                };

                formatter = {
                  indentStyle = "space";
                  indentWidth = 2;
                  lineWidth = 310;
                  inherit ignore;
                };

                javascript.formatter = {
                  semicolons = "asNeeded";
                  trailingComma = "none";
                  quoteStyle = "single";
                };
              };
          };

          shfmt = {
            enable = true;
            indent_size = 2;
          };
        };
      };
    };
}
