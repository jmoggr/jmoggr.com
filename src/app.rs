use crate::talks::game_networking_part_1::GameNetworkingPart1;
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
        <Title text="Welcome"/>
        <Router>
            <main>
                <Routes fallback=|| "Page not found.".into_view()>
                    <Route path=path!("") view=HomePage/>
                    <Route path=path!("/talks/game-networking-part-1/") view=GameNetworkingPart1/>
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
        h1 {
            color: #333;
        }
        h2 {
            color: #555;
            margin-top: 2rem;
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
            <h1>"Welcome to Leptos"</h1>
            <p>"This page is server-side rendered."</p>
            <Counter/>

            <h2>"Talks"</h2>
            <ul>
                <li>
                    <a href="/talks/game-networking-part-1/">"Game Networking Part 1"</a>
                </li>
            </ul>
        </div>
    }
}

/// An interactive island component that hydrates on the client
#[island]
fn Counter() -> impl IntoView {
    let count = RwSignal::new(0);

    let styles = style!(
        div {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-top: 2rem;
            padding: 1rem;
            background: white;
            border-radius: 8px;
        }
        button {
            padding: 0.5rem 1rem;
            font-size: 1.25rem;
            border: none;
            border-radius: 4px;
            background-color: #4f46e5;
            color: white;
            cursor: pointer;
        }
        & button:hover {
            background-color: #4338ca;
        }
        span {
            font-size: 1.5rem;
            font-weight: bold;
            min-width: 3rem;
            text-align: center;
        }
    );

    styled::view! {
        styles,
        <div>
            <p>"This counter is an interactive island:"</p>
            <button on:click=move |_| *count.write() -= 1>"-1"</button>
            <span>{count}</span>
            <button on:click=move |_| *count.write() += 1>"+1"</button>
        </div>
    }
}
