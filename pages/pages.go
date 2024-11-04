package pages

import g "github.com/maragudk/gomponents"

type Operation func(*PageProps, []PageProps) g.Node
type PageProps struct {
	Title  string
	Path   string
	Render Operation
}

var Pages = []PageProps{
	{
		Title:  "Home",
		Path:   "/",
		Render: Home,
	},
	{
		Title:  "About",
		Path:   "/about",
		Render: About,
	},
}
