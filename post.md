Build a SSR site using go, have wget scrape the site, deploy the scraped files as a static website on github pages.


Naturally one of the biggest hurdles overcome in setting up this website was deciding the tech stack I was going to use to build it.

I wanted a static website, and wanted to leverage my existing skills and knowledge (read: I took a look at the "content management" section of the hugo docs).

I just want to put my content in a directoy somewhere, and write some code to turn it into a webpage. I accept that I'll be writing some boilerplate. I would much rather learn the ins and outs of a parsing markdown with a library, instead of indirectly through another tool.e

This basically means that I have inflicted another "I'll just build it myself" on myself.

Previous attempts at this have involved various ways of transforming blobs of text until it looked like a website. This has involved bash, C Preprocessor, Make, python, asciidoc, markdown... it always ended up being a ball of spagetti that still fell annoyingly far outside of the "traditional" web development workflow.

This time I was determined to have my cake and eat it.