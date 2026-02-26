use leptos::prelude::*;
use styled::style;

#[component]
pub fn GameNetworkingPart1() -> impl IntoView {
    let styles = style!(
        div {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
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
            margin: 0.75rem 0;
        }
        a {
            color: #4f46e5;
            text-decoration: none;
            font-size: 1.1rem;
        }
        & a:hover {
            text-decoration: underline;
        }
        .description {
            color: #666;
            font-size: 0.9rem;
            margin-left: 1rem;
        }
    );

    styled::view! {
        styles,
        <div>
            <h1>"Game Networking Part 1"</h1>
            <p>"An introduction to game networking concepts with interactive demos."</p>

            <h2>"Slides"</h2>
            <ul>
                <li>
                    <a href="/talks/game-networking-part-1/slides/">"View Presentation"</a>
                </li>
            </ul>

            <h2>"Interactive Demos"</h2>
            <ul>
                <li>
                    <a href="/talks/game-networking-part-1/demos/demo1/">"Demo 1"</a>
                    <span class="description">" - Basic WebSocket connection"</span>
                </li>
                <li>
                    <a href="/talks/game-networking-part-1/demos/demo2/">"Demo 2"</a>
                    <span class="description">" - Placeholder"</span>
                </li>
                <li>
                    <a href="/talks/game-networking-part-1/demos/demo3/">"Demo 3"</a>
                    <span class="description">" - Placeholder"</span>
                </li>
            </ul>

            <p><a href="/">"← Back to home"</a></p>
        </div>
    }
}
