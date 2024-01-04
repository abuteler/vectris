use super::{CELLS_PER_ROW,CELLS_PER_COL};

#[derive(Copy, Clone, Debug, PartialEq)]
pub struct Grid {
    pub cells_per_row: u8,
    pub cells_per_col: u8,
}

impl Grid {
    pub fn new(x: u8, y: u8) -> Self {
        Self {
            cells_per_row: x,
            cells_per_col: y,
        }
    }
}

impl Default for Grid {
    fn default() -> Self {
        Self::new(CELLS_PER_ROW, CELLS_PER_COL)
    }
}