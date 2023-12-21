
pub struct Grid {
  squaresPerRow: u8,
  squaresPerCol: u8
}

impl Grid {
  fn new() -> Self {
    Self {
      squaresPerRow: 10,
      squaresPerCol: 16
    }
  }
}