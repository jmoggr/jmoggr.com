package pages

import (
	. "website/components"

	g "github.com/maragudk/gomponents"
	. "github.com/maragudk/gomponents/html"
)

func Home(page *PageProps, pages []PageProps) g.Node {
	return Div(
		Headline("Home 2"),

		SubHeadline("All routes: "),
		Ul(
			g.Map(pages, func(i PageProps) g.Node {
				return Li(g.Text(i.Path))
			})...,
		),
	)
}
