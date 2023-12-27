mod model;
use model::gamestate::GameState;

pub const CELLS_PER_ROW: u8 = 10;
pub const CELLS_PER_COL: u8 = 16;

pub struct Vectris {
    game_state: GameState,
}

impl Vectris {
    pub fn new() -> Self {
        Self {
            game_state: GameState::new(),
        }
    }
}
