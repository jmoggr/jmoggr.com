use crate::talks::introduction_to_multiplayer_networking::IntroductionToMultiplayerNetworking;
use leptos::prelude::*;
use leptos_meta::*;
use leptos_router::{
    components::{Route, Router, Routes},
    path,
};
use styled::style;

pub fn shell(options: LeptosOptions) -> impl IntoView {
    view! {
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <AutoReload options=options.clone()/>
                <HydrationScripts options islands=true/>
                <MetaTags/>
            </head>
            <body>
                <App/>
            </body>
        </html>
    }
}

#[component]
pub fn App() -> impl IntoView {
    provide_meta_context();

    let styles = style!(
        body {
            font-family: system-ui, sans-serif;
            margin: 0;
            padding: 2rem;
            background-color: #f5f5f5;
        }
    );

    styled::view! {
        styles,
        <Title text="jmoggr"/>
        <Router>
            <main>
                <Routes fallback=|| "Page not found.".into_view()>
                    <Route path=path!("") view=HomePage/>
                    <Route path=path!("/talks/introduction-to-multiplayer-networking/") view=IntroductionToMultiplayerNetworking/>
                </Routes>
            </main>
        </Router>
    }
}

#[component]
fn HomePage() -> impl IntoView {
    let styles = style!(
        div {
            max-width: 800px;
            margin: 0 auto;
        }
        h2 {
            color: #333;
        }
        ul {
            list-style: none;
            padding: 0;
        }
        li {
            margin: 0.5rem 0;
        }
        a {
            color: #4f46e5;
            text-decoration: none;
        }
        & a:hover {
            text-decoration: underline;
        }
    );

    styled::view! {
        styles,
        <div>
            <h2>"Talks"</h2>
            <ul>
                <li>
                    <a href="/talks/introduction-to-multiplayer-networking/">"Introduction to Multiplayer Networking"</a>
                </li>
            </ul>
        </div>
    }
}

