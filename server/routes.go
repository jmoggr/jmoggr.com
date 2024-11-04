package server

import (
	"log"
	"net/http"
	"website/components"
	"website/pages"
)

func handlePage(logger *log.Logger, page *pages.PageProps, pages []pages.PageProps) http.Handler {
	return http.HandlerFunc(
		func(w http.ResponseWriter, r *http.Request) {
			var component = page.Render(page, pages)

			var p = components.Page(components.Props{
				Title:   page.Title,
				Content: component,
				Path:    r.URL.Path,
			})

			logger.Printf("Serving %s %s\n", page.Path, r.URL.Path)

			p.Render(w)
		},
	)
}

func Static(mux *http.ServeMux) {
	fileServer := http.FileServer(http.Dir("static"))
	staticHandler := http.StripPrefix("/static/", fileServer)
	mux.Handle("/static/", staticHandler)
}

func addRoutes(
	mux *http.ServeMux,
	logger *log.Logger,
) {
	for _, page := range pages.Pages {
		logger.Printf("Adding route %s\n", page.Path)
		pageCopy := page
		mux.Handle(page.Path, handlePage(logger, &pageCopy, pages.Pages))
	}

	Static(mux)
}
