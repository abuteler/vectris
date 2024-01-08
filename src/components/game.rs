use leptos::*;
use super::{GameNav, GameCanvas};

#[component]
pub fn Game() -> impl IntoView {
  
  view! {
    <section id="game-canvas">
      <GameNav />
      <GameCanvas />
    </section>
  }
}
