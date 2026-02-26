use axum::Router;
use leptos::prelude::*;
use leptos_axum::{generate_route_list, LeptosRoutes};
use jmoggr::app::*;
use tower_http::services::ServeDir;

#[tokio::main]
async fn main() {
    let conf = get_configuration(None).unwrap();
    let leptos_options = conf.leptos_options;
    let addr = leptos_options.site_addr;
    let routes = generate_route_list(App);

    // Get talks directory from env, default to "./talks" for dev
    let talks_dir = std::env::var("TALKS_DIR").unwrap_or_else(|_| "./talks".to_string());

    let app = Router::new()
        .leptos_routes(&leptos_options, routes, {
            let leptos_options = leptos_options.clone();
            move || shell(leptos_options.clone())
        })
        // ServeDir comes after - handles /talks/*/slides/ and /talks/*/demos/
        .nest_service("/talks", ServeDir::new(&talks_dir))
        .fallback(leptos_axum::file_and_error_handler::<LeptosOptions, _>(shell))
        .with_state(leptos_options);

    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    println!("listening on http://{}", &addr);
    println!("serving talks from: {}", &talks_dir);
    axum::serve(listener, app.into_make_service())
        .await
        .unwrap();
}
