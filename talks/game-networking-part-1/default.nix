{ pkgs, ... }:
let
  inherit (pkgs) lib;
  name = "game-networking-part-1";

  # Build slides separately
  slides = pkgs.stdenv.mkDerivation {
    pname = "${name}-slides";
    version = "0.1.0";

    src = lib.fileset.toSource {
      root = ./slides;
      fileset = lib.fileset.unions [
        ./slides/package.json
        ./slides/pnpm-lock.yaml
        ./slides/slides.md
        ./slides/.npmrc
      ];
    };

    nativeBuildInputs = with pkgs; [
      nodejs
      pnpm.configHook
    ];

    pnpmDeps = pkgs.fetchPnpmDeps {
      pname = "${name}-slides-deps";
      src = lib.fileset.toSource {
        root = ./slides;
        fileset = lib.fileset.unions [
          ./slides/package.json
          ./slides/pnpm-lock.yaml
          ./slides/.npmrc
        ];
      };
      hash = "sha256-m2/k7r4DEkUCsGywMJuujfxSu2U2SYTyjGJL/VsiT28=";
      fetcherVersion = 2;
    };

    buildPhase = ''
      pnpm build
    '';

    installPhase = ''
      mkdir -p $out
      cp dist/index.html $out/
    '';
  };

in
pkgs.stdenv.mkDerivation {
  pname = name;
  version = "0.1.0";

  src = lib.fileset.toSource {
    root = ./.;
    fileset = ./demos;
  };

  nativeBuildInputs = with pkgs; [ bun ];

  buildPhase = ''
    # Build demo client.js files with bun
    for demo in demo1 demo2 demo3; do
      bun build demos/$demo/client.ts --outfile demos/$demo/client.js --format=iife
    done
  '';

  installPhase = ''
    mkdir -p $out/slides $out/demos

    # Copy pre-built slides
    cp ${slides}/index.html $out/slides/

    # Copy demos
    for demo in demo1 demo2 demo3; do
      mkdir -p $out/demos/$demo
      cp demos/$demo/index.html $out/demos/$demo/
      cp demos/$demo/client.js $out/demos/$demo/
    done
  '';
}
