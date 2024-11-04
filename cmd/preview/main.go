package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	// Directory where the build files are located
	buildDir := "./build"

	// Custom handler that serves files, resolving paths like "/about" to "/about.html"
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Get the requested path
		path := r.URL.Path

		// Create the absolute path for the file based on the build directory
		fullPath := filepath.Join(buildDir, filepath.Clean(path))

		// Early return if the file exists as requested
		if _, err := os.Stat(fullPath); err == nil {
			http.FileServer(http.Dir(buildDir)).ServeHTTP(w, r)
			return
		}

		// Check if appending ".html" helps
		htmlPath := fullPath + ".html"
		if _, err := os.Stat(htmlPath); err == nil {
			// If the ".html" file exists, serve it
			http.ServeFile(w, r, htmlPath)
			return
		}

		// Fallback to the default file server for other cases
		http.FileServer(http.Dir(buildDir)).ServeHTTP(w, r)
	})

	// Start the web server on port 8080
	port := "8080"
	log.Printf("Serving files from %s on http://localhost:%s", buildDir, port)
	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		log.Fatal("Error starting the server: ", err)
	}
}
