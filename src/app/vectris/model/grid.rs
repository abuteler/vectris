use super::{CELLS_PER_COL, CELLS_PER_ROW};
pub struct Grid {
    cells_per_row: u8,
    cells_per_col: u8,
}

impl Grid {
    pub fn new() -> Self {
        Self {
            cells_per_row: CELLS_PER_ROW,
            cells_per_col: CELLS_PER_COL,
        }
    }
}
