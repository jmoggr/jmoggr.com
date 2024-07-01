package pages

import (
	. "website/components"

	g "github.com/maragudk/gomponents"
	. "github.com/maragudk/gomponents/html"
)

func About(page *PageProps, _ []PageProps) g.Node {
	return Div(
		Headline("About"),
	)
}
