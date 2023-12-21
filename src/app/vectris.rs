enum Status {
  InMenu, Paused, Playing
}

struct Vectris {
  burnedLines: u32,
  currentShape: Box<Shape>, // why a Box?
  nextShape: Box<Shape>,
  gameStatus: Status,
  grid: Grid,
  moveset: Moveset,
}