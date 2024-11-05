## Development

`go run cmd/develop/main.go` should start server on `localhost:8080`

posts ideas
- this static website builder
- benchy
- kobo holder
- keyboards

#### Errors

##### Missing static/styles.css

![run function failed: exit status 8](static/missing-styles-error.png.png)

The error occurs because `static/styles.css` is not present when `wget` is downloading the site. This is most likely because `tailwind` was not run or failed to generate the file.