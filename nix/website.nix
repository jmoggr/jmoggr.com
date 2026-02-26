{
  pkgs,
  craneLib,
  cargo-leptos-custom,
  wasm-bindgen-cli,
  talks,
  ...
}:
let
  # Source filtering for crane
  src = craneLib.cleanCargoSource ./..;

  # Common args for crane builds
  commonArgs = {
    inherit src;
    pname = "jmoggr";
    version = "0.1.0";
    strictDeps = true;
  };

  # Build dependencies (cached)
  cargoArtifacts = craneLib.buildDepsOnly commonArgs;

  # Build the Leptos server using cargo-leptos with cached deps
  server = craneLib.mkCargoDerivation (commonArgs // {
    inherit cargoArtifacts;

    nativeBuildInputs = [
      wasm-bindgen-cli
      cargo-leptos-custom
      pkgs.binaryen
    ];

    buildPhaseCargoCommand = ''
      cargo leptos build --release
    '';

    installPhaseCommand = ''
      mkdir -p $out/bin $out/site $out/talks
      cp target/release/jmoggr $out/bin/
      cp -r target/site/* $out/site/

      # Copy talks into the package
      cp -r ${talks.introduction-to-multiplayer-networking} $out/talks/introduction-to-multiplayer-networking
    '';

    doCheck = false;
  });

  # Static site built by scraping the running server
  static = pkgs.stdenv.mkDerivation {
    pname = "jmoggr-static";
    version = "0.1.0";

    # No source needed - we use the built server
    dontUnpack = true;

    nativeBuildInputs = with pkgs; [ wget gnused findutils ];

    buildPhase = ''
      BUILD_DIR=$(pwd)
      ADDR="127.0.0.1:3456"

      # Start the server in background
      export LEPTOS_SITE_ROOT="${server}/site"
      export LEPTOS_SITE_ADDR="$ADDR"
      export TALKS_DIR="${server}/talks"
      ${server}/bin/jmoggr &
      SERVER_PID=$!

      # Wait for server to be ready
      wget -q --spider --retry-connrefused --waitretry=1 --tries=30 "http://$ADDR/"

      # Scrape the site with wget (recursive crawl will follow links to /talks/)
      mkdir -p "$BUILD_DIR/site"
      wget \
        --directory-prefix="$BUILD_DIR/site" \
        --recursive \
        --no-clobber \
        --page-requisites \
        --html-extension \
        --convert-links \
        --restrict-file-names=windows \
        --domains 127.0.0.1 \
        --no-parent \
        --no-host-directories \
        --tries=3 \
        --timeout=10 \
        "http://$ADDR/" || true

      # Explicitly fetch the talks landing page and its linked content
      wget \
        --directory-prefix="$BUILD_DIR/site" \
        --recursive \
        --level=2 \
        --no-clobber \
        --page-requisites \
        --html-extension \
        --convert-links \
        --restrict-file-names=windows \
        --domains 127.0.0.1 \
        --no-parent \
        --no-host-directories \
        --tries=3 \
        --timeout=10 \
        "http://$ADDR/talks/introduction-to-multiplayer-networking/" || true

      # Stop the server
      kill $SERVER_PID 2>/dev/null || true
      wait $SERVER_PID 2>/dev/null || true

      # Fix hardcoded localhost URLs in HTML files
      find "$BUILD_DIR/site" -name "*.html" -exec sed -i \
        -e 's|http://127.0.0.1:3456/|/|g' \
        -e 's|http://127.0.0.1:3456|/|g' \
        {} \;

      echo "Contents of site directory:"
      ls -la $BUILD_DIR/site/
    '';

    installPhase = ''
      cp -r site/. $out/
    '';
  };

  # Preview script for the static site
  preview = pkgs.writeShellScriptBin "preview-static" ''
    SITE_PATH="''${1:-${static}}"
    PORT="''${2:-8080}"

    echo "Serving static site from: $SITE_PATH"
    echo "Preview at: http://localhost:$PORT"
    echo "Press Ctrl+C to stop"

    ${pkgs.python3}/bin/python3 -m http.server "$PORT" --directory "$SITE_PATH"
  '';

in
{
  inherit server static preview;
}
