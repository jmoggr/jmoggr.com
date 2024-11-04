package server

import (
	"context"
	"log"
	"net"
	"net/http"
	"time"
)

type Config struct {
	Host string
	Port string
}

func newServer(
	logger *log.Logger,
) http.Handler {
	mux := http.NewServeMux()
	addRoutes(mux, logger)
	var handler http.Handler = mux
	// middleware
	return handler
}

func StartServer(ctx context.Context, logger *log.Logger, config *Config) error {
	srv := newServer(
		logger,
	)

	httpServer := &http.Server{
		Addr:    net.JoinHostPort(config.Host, config.Port),
		Handler: srv,
	}

	// Start the server in a goroutine
	go func() {
		logger.Printf("Listening on %s\n", httpServer.Addr)
		if err := httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatalf("ListenAndServe(): %v", err)
		}
	}()

	// Wait for the context to be canceled
	<-ctx.Done()

	logger.Println("Shutting down server...")

	// Create a context with a timeout for the server shutdown
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer shutdownCancel()

	// Shutdown the server gracefully
	if err := httpServer.Shutdown(shutdownCtx); err != nil {
		return err
	}

	logger.Println("Server gracefully stopped")

	return nil
}
