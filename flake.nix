{
  description = "SFF admin app";

  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "nixpkgs/nixos-24.05";
  };

    outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config = {};
        };
      in
      {
        devShells = {
          default = pkgs.mkShell {
            buildInputs = [
              pkgs.go
              pkgs.git
              pkgs.nodePackages.pnpm
              pkgs.nodejs_22
            ];

            shellHook = ''
              export GOPATH=$PWD/.go
              export PATH=$GOPATH/bin:$PATH
              export PATH="$PWD/node_modules/.bin/:$PATH"
            '';
          };
        };
      });
}