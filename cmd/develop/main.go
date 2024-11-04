package main

import (
	"context"
	"io"
	"log"
	"os"
	"os/signal"
	"syscall"

	"website/server"
)

func run(ctx context.Context, w io.Writer) error {
	// Create a context that is canceled when an interrupt signal is received
	ctx, cancel := signal.NotifyContext(ctx, os.Interrupt, syscall.SIGTERM)
	defer cancel()

	logger := log.New(w, "http: ", log.LstdFlags)
	config := &server.Config{Host: "localhost", Port: "8080"}

	if err := server.StartServer(ctx, logger, config); err != nil {
		return err
	}

	return nil
}

func main() {
	ctx := context.Background()
	if err := run(ctx, os.Stdout); err != nil {
		log.Fatalf("run function failed: %v", err)
	}
}
