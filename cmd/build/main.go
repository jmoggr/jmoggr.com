package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"os"
	"os/exec"
	"os/signal"
	"syscall"
	"time"
	"website/server"
)

func run(ctx context.Context, w io.Writer) error {
	buildDir := "build"

	// Create a context that is canceled when an interrupt signal is received
	ctx, cancel := signal.NotifyContext(ctx, os.Interrupt, syscall.SIGTERM)
	defer cancel()

	logger := log.New(w, "http: ", log.LstdFlags)
	config := &server.Config{Host: "localhost", Port: "8080"}

	err := os.RemoveAll(buildDir)
	if err != nil {
		// Handle the error if something goes wrong
		fmt.Println("Error deleting directory:", err)
		return err
	}

	cmd := exec.Command("node_modules/.bin/tailwind", "--output", "static/styles.css")
	if err := cmd.Run(); err != nil {
		logger.Printf("wget failed: %v", err)
		return err
	}

	// Start the server in a goroutine
	go func() {
		if err := server.StartServer(ctx, logger, config); err != nil {
			logger.Printf("Server failed: %v", err)
		}
	}()

	// Give the server a moment to start
	<-time.After(1 * time.Second)

	// Command to run wget
	cmd = exec.Command("wget", "--mirror", "--adjust-extension", "--page-requisites", "--no-parent", "--no-host-directories", "-P", buildDir, "http://localhost:8080")
	if err := cmd.Run(); err != nil {
		logger.Printf("wget failed: %v", err)
		return err
	}

	err = os.Remove(buildDir + "/robots.txt.html")
	if err != nil {
		log.Fatal(err)
	}

	// Signal to stop the server
	cancel() // This will cause StartServer to return if it listens to ctx.Done()
	return nil
}

func main() {
	ctx := context.Background()
	if err := run(ctx, os.Stdout); err != nil {
		log.Fatalf("run function failed: %v", err)
	}
}
