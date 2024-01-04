use std::fmt;

use leptos::{RwSignal, create_rw_signal};
mod model;
mod controller;
pub use model::{Grid, Shape};
pub use controller::Controls;

pub const CELLS_PER_ROW: u8 = 10;
pub const CELLS_PER_COL: u8 = 16;

#[derive(Copy, Clone, Debug, Default, PartialEq)]
pub enum Status {
    #[default] InMenus,
    Paused,
    Playing,
    GameOver,
}
impl fmt::Display for Status {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            Status::InMenus => write!(f, "InMenus"),
            Status::Paused => write!(f, "Paused"),
            Status::Playing => write!(f, "Playing"),
            Status::GameOver => write!(f, "GameOver"),
        }
    }
}

#[derive(Copy, Clone, Debug, Default)]
pub struct GameState {
    pub burned_lines: u32,
    pub current_shape: Shape,
    pub next_shape: Shape,
    pub status: Status,
    pub grid: Grid,
}

impl GameState {
    pub fn new() -> Self {
        Self {
            burned_lines: 0,
            current_shape: Shape::default(),
            next_shape: Shape::default(),
            status: Status::InMenus,
            grid: Grid::new(CELLS_PER_ROW, CELLS_PER_COL),
        }
    }
}

impl Controls for GameState {}
