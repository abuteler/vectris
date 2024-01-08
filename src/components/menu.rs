use leptos::*;
use crate::{GameState, Status};

#[component]
pub fn Menu() -> impl IntoView {
    let state = expect_context::<RwSignal<GameState>>();
    let (status, set_status) = create_slice(
        state,
        |state| state.status,
        |state, status| {
            state.status = status
        },
    );
    let start_game = move |_| {
      set_status.set(Status::Playing)
    };

    view! {
      <section id="menu">
        <nav>
          <h2>Menu</h2>
          <h3>{status.get().to_string()}</h3>
          <ul id="main-menu">
            <li on:click=start_game>Play</li>
            <li>About</li>
            <li>Credits</li>
          </ul>
        </nav>
      </section>
    }
}
