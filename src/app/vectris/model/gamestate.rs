use super::grid::Grid;
use super::moveset::Moveset;
use super::shape::Shape;

enum Status {
  InMenu, Paused, Playing
}

pub struct GameState {
  burned_lines: u32,
  current_shape: Shape,
  next_shape: Shape,
  status: Status,
  grid: Grid,
  moveset: Moveset,
}

impl GameState {
  pub fn new () -> Self {
    Self {
      burned_lines: 0,
      current_shape: Shape::new(),
      next_shape: Shape::new(),
      status: Status::Playing,
      grid: Grid::new(),
      moveset: Moveset::initialize()
    }
  }
}