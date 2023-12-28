pub mod controller;
use controller::Controller;
mod model;
use model::gamestate::GameState;
mod view;
use view::View;

pub const CELLS_PER_ROW: u8 = 10;
pub const CELLS_PER_COL: u8 = 16;

pub struct Vectris {
    state: GameState,
}

impl Vectris {
    pub fn new() -> Self {
        Self {
            state: GameState::new(),
        }
    }
}

impl Controller for Vectris {
    fn on_key_up(&self) {
        println!("{} on_key_up", 1)
    }
    fn on_key_down(&self) {
        println!("{} on_key_down", 1)
    }
    fn on_key_left(&self) {
        println!("{} on_key_left", 1)
    }
}
