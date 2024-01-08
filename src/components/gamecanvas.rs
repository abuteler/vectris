use leptos::*;
use crate::{GameState, Grid};

#[component]
pub fn GameCanvas() -> impl IntoView {
  let state = expect_context::<RwSignal<GameState>>();
  let grid = create_read_slice(state, |state| state.grid);
  let Grid {cells_per_row, cells_per_col} = grid.get();
  view! {
    <section id="game-canvas">
      {cells_per_row} - {cells_per_col}
    </section>
  }
}
