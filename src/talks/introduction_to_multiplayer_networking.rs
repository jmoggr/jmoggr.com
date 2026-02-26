use leptos::prelude::*;
use styled::style;

#[component]
pub fn IntroductionToMultiplayerNetworking() -> impl IntoView {
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
            <h1>"Introduction to Multiplayer Networking"</h1>
            <p><a href="https://github.com/jmoggr/jmoggr.com/tree/main/talks/introduction-to-multiplayer-networking">"View source on GitHub"</a></p>

            <h2>"Slides"</h2>
            <ul>
                <li>
                    <a href="/talks/introduction-to-multiplayer-networking/slides/">"View Presentation"</a>
                </li>
            </ul>

            <h2>"Interactive Demos"</h2>
            <ul>
                <li>
                    <a href="/talks/introduction-to-multiplayer-networking/demos/demo1/">"Demo 1"</a>
                    <span class="description">" - Full State Snapshots"</span>
                </li>
                <li>
                    <a href="/talks/introduction-to-multiplayer-networking/demos/demo2/">"Demo 2"</a>
                    <span class="description">" - Optimistic Updates, with de-sync"</span>
                </li>
                <li>
                    <a href="/talks/introduction-to-multiplayer-networking/demos/demo3/">"Demo 3"</a>
                    <span class="description">" - Optimistic Updates, no de-sync"</span>
                </li>
            </ul>

            <h2>"Resources"</h2>
            <ul>
                <li>
                    <a href="https://www.gabrielgambetta.com/client-server-game-architecture.html">"Fast-Paced Multiplayer (Gabriel Gambetta)"</a>
                </li>
                <li>
                    <a href="https://fabiensanglard.net/quake3/network.php">"Quake 3 Network Model (Fabien Sanglard)"</a>
                </li>
                <li>
                    <a href="https://gafferongames.com/">"Gaffer On Games"</a>
                </li>
                <li>
                    <a href="https://github.com/0xFA11/MultiplayerNetworkingResources">"Multiplayer Networking Resources (GitHub)"</a>
                </li>
            </ul>

            <p><a href="/">"← Back to home"</a></p>
        </div>
    }
}
