use leptos::leptos_dom::{
    ev::{keydown, KeyboardEvent},
    helpers::window_event_listener,
};
use leptos::*;
use wasm_bindgen::prelude::*;
use web_sys::console;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = ["window", "__TAURI__", "tauri"])]
    async fn invoke(cmd: &str, args: JsValue) -> JsValue;
}

use vectris_ui::components::{Menu, Game};
use vectris_ui::{Controls, GameState, Status};


#[component]
pub fn App() -> impl IntoView {
    provide_context(create_rw_signal(GameState::default()));
    let state = expect_context::<RwSignal<GameState>>();
    let status = create_read_slice(state, |state| state.status);
    let (key_pressed, set_key_pressed) = create_signal(String::new());
    let handler = window_event_listener(keydown, move |ev: KeyboardEvent| {
        let key = &ev.key_code();
        set_key_pressed.set(key.to_string());
        // match key {
        //     37 => vectris.on_key_left(),
        //     38 => vectris.on_key_up(),
        //     39 => vectris.on_key_right(),
        //     40 => vectris.on_key_down(),
        //     _ => {}
        // }
    });
    on_cleanup(move || handler.remove());
    view! {
        <main class="container">
          <header>
            <h1>Vectris</h1>
          </header>
          <b>Pressed key:{ move || key_pressed.get() }</b>
          <Show
            when= move || matches!(status.get(), Status::InMenus)
            fallback= move || view! { <Game /> }
          >
            <Menu />
          </Show>
          {status.get().to_string()}
        </main>
    }
}
