pub enum Color {
    Violet,
    Green,
    Blue,
    Yellow,
    Red,
    LightBlue,
    Pink,
}
impl Color {
    pub fn as_str(&self) -> &'static str {
        match self {
            // should I dereference self? aka `*self`
            Color::Violet => "rgb(150,0,160)",
            Color::Green => "rgb(0,150,0)",
            Color::Blue => "rgb(0,0,180)",
            Color::Yellow => "rgb(210,190,0)",
            Color::Red => "rgb(180,0,0)",
            Color::LightBlue => "rgb(170,210,230)",
            Color::Pink => "rgb(230,0,200)",
        }
    }
}

pub struct Cell {
    coordinates: (u8, u8),
    is_vacant: bool,
    color: Option<Color>,
}
impl Cell {
    pub fn new(x: u8, y: u8, is_vacant: bool, color: Option<Color>) -> Self {
        Self {
            coordinates: (x, y),
            is_vacant,
            color,
        }
    }
}
