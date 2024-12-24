{
  description = "Stardust";

  inputs = {
    nixpkgs = {
      type = "github";
      owner = "NixOS";
      repo = "nixpkgs";
      ref = "nixpkgs-unstable";
    };

    flake-parts = {
      type = "github";
      owner = "hercules-ci";
      repo = "flake-parts";
      inputs.nixpkgs-lib.follows = "nixpkgs";
    };

    # a tree-wide formatter
    treefmt-nix = {
      type = "github";
      owner = "numtide";
      repo = "treefmt-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    systems = {
      type = "github";
      owner = "nix-systems";
      repo = "default";
    };
  };

  outputs =
    inputs:
    inputs.flake-parts.lib.mkFlake { inherit inputs; } {
      imports = [ inputs.treefmt-nix.flakeModule ];

      systems = [
        "x86_64-linux"
        "x86_64-darwin"
        # who the hell has aarch64 in the big 24 bro like come on do better
      ];

      perSystem =
        {
          lib,
          pkgs,
          self',
          config,
          inputs',
          system,
          ...
        }:
        {
          # this is what controls how packages in the flake are built, but this is not passed to the
          # builders in lib which is important to note, since we have to do something different for
          # the builders to work correctly
          _module.args.pkgs = import inputs.nixpkgs {
            inherit system;
            config = {
              allowUnfree = true;
              allowUnsupportedSystem = true;
            };
            overlays = [ ];
          };

          formatter = config.treefmt.build.wrapper;

          treefmt = {
            projectRootFile = "flake.nix";

            programs = {
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
    };
}
