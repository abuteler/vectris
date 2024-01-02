use leptos::ev::keydown;
use leptos::leptos_dom::{ev::KeyboardEvent, helpers::window_event_listener};
use leptos::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = ["window", "__TAURI__", "tauri"])]
    async fn invoke(cmd: &str, args: JsValue) -> JsValue;
}

// mod vectris;
// use vectris::{Vectris, controller::Controls};

#[component]
pub fn App() -> impl IntoView {
    // let vectris = Vectris::new();
    // vectris.on_key_up();
    let (key_pressed, set_key_pressed) = create_signal(String::new());
    let handler = window_event_listener(keydown, move |ev: KeyboardEvent| {
        let v = &ev.key_code();
        set_key_pressed.set(v.to_string());
    });
    on_cleanup(move || handler.remove());

    view! {
        <main class="container">
            <h1>Vectris</h1>
            <p><b>{ move || key_pressed.get() }</b></p>
        </main>
    }
}
