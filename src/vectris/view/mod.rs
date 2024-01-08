pub trait Renderer {
  fn render_grid (&self) {}
  fn render_nav (&self) {}
  fn render_score (&self) {}
  fn render_next_shape (&self) {}
}