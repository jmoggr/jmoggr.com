{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.11";
    fenix = {
      url = "github:nix-community/fenix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    crane.url = "github:ipetkov/crane";
  };

  outputs =
    inputs:
    let
      system = "x86_64-linux";

      pkgs = import inputs.nixpkgs { inherit system; };

      rustToolchain = inputs.fenix.packages.${system}.fromToolchainFile {
        file = ./rust-toolchain.toml;
        sha256 = "sha256-Qxt8XAuaUR2OMdKbN4u8dBJOhSHxS+uS06Wl9+flVEk=";
      };

      # Set up crane with fenix toolchain
      craneLib = (inputs.crane.mkLib pkgs).overrideToolchain rustToolchain;

      # Custom cargo-leptos with specific version
      cargo-leptos-custom = pkgs.cargo-leptos.overrideAttrs (oldAttrs: rec {
        version = "0.3.1";

        src = pkgs.fetchFromGitHub {
          owner = "leptos-rs";
          repo = "cargo-leptos";
          rev = "v${version}";
          hash = "sha256-vQZpw0hnBQRXmt4KsThcVwLtRwSpbjaGfojCIgfOn7E=";
        };

        cargoDeps = pkgs.rustPlatform.fetchCargoVendor {
          inherit src;
          name = "cargo-leptos-${version}";
          hash = "sha256-WlzkTZHWDkE2rhH+fi8+aa/mkjBEVwQK8cTxd2JUuZ8=";
        };
      });

      wasm-bindgen-cli = pkgs.buildWasmBindgenCli rec {
        src = pkgs.fetchCrate {
          pname = "wasm-bindgen-cli";
          version = "0.2.113";
          hash = "sha256-CWxeRhlO1i4Yq93OVLFDvJFIaBB7q2Ps0yqk+Euz+8w=";
        };
        cargoDeps = pkgs.rustPlatform.fetchCargoVendor {
          inherit src;
          inherit (src) pname version;
          hash = "sha256-XmIx55PKfu+tVUGFC7MGF4AAYeV7z/p3KuLnY0bYMH8=";
        };
      };

      # Talks
      talks = {
        game-networking-part-1 = import ./talks/game-networking-part-1 { inherit pkgs; };
      };

      # Website (server, static site, preview)
      website = import ./nix/website.nix {
        inherit
          pkgs
          craneLib
          cargo-leptos-custom
          wasm-bindgen-cli
          talks
          ;
      };

      # Common development packages
      devPackages = with pkgs; [
        pkg-config
        nodejs
        pnpm
        bun
        rustToolchain
        wasm-bindgen-cli
        cargo-leptos-custom
      ];

    in
    {
      packages.${system} = {
        default = website.static;
        static = website.static;
        preview = website.preview;
        talks-game-networking-part-1 = talks.game-networking-part-1;
      };

      devShells.${system}.default = pkgs.mkShell {
        buildInputs = devPackages ++ [ website.preview ];
        shellHook = ''
          alias c=cargo
        '';
      };
    };
}
