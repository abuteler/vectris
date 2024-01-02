use super::cell::Cell;
use super::color::Color;

pub struct Shape {
    cells: [Cell; 4],
}

use super::CELLS_PER_ROW;
use rand::prelude::*;

impl Shape {
    pub fn new() -> Self {
        // randomize a number between 1 and 7
        let num: u8 = rand::thread_rng().gen_range(1, 7);
        let x: u8 = CELLS_PER_ROW / 2;
        match num {
            // Square
            1 => Shape {
                cells: [
                    Cell::new(x, 0, false, Some(Color::Violet)),
                    Cell::new(x, 1, false, Some(Color::Violet)),
                    Cell::new(x + 1, 0, false, Some(Color::Violet)),
                    Cell::new(x + 1, 1, false, Some(Color::Violet)),
                ],
            },
            // Column
            2 => Shape {
                cells: [
                    Cell::new(x, 0, false, Some(Color::Green)),
                    Cell::new(x, 1, false, Some(Color::Green)),
                    Cell::new(x, 2, false, Some(Color::Green)),
                    Cell::new(x, 3, false, Some(Color::Green)),
                ],
            },
            // Left L
            3 => Shape {
                cells: [
                    Cell::new(x+1, 0, false, Some(Color::Blue)),
                    Cell::new(x+1, 1, false, Some(Color::Blue)),
                    Cell::new(x+1, 2, false, Some(Color::Blue)),
                    Cell::new(x, 2, false, Some(Color::Blue)),
                ],
            },
            // Right L
            4 => Shape {
                cells: [
                    Cell::new(x, 0, false, Some(Color::Yellow)),
                    Cell::new(x, 1, false, Some(Color::Yellow)),
                    Cell::new(x, 2, false, Some(Color::Yellow)),
                    Cell::new(x+1, 2, false, Some(Color::Yellow)),
                ],
            },
            // Left "lightning"
            5 => Shape {
                cells: [
                    Cell::new(x+1, 0, false, Some(Color::Red)),
                    Cell::new(x+1, 1, false, Some(Color::Red)),
                    Cell::new(x, 1, false, Some(Color::Red)),
                    Cell::new(x, 2, false, Some(Color::Red)),
                ],
            },
            // Right "lightning"
            6 => Shape {
                cells: [
                    Cell::new(x, 0, false, Some(Color::LightBlue)),
                    Cell::new(x, 1, false, Some(Color::LightBlue)),
                    Cell::new(x+1, 1, false, Some(Color::LightBlue)),
                    Cell::new(x+1, 2, false, Some(Color::LightBlue)),
                ],
            },
            // Tripod; num = 7; wildcard to avoid compiler complaints.
            _ => Shape { 
                cells: [
                    Cell::new(x, 0, false, Some(Color::Pink)),
                    Cell::new(x, 1, false, Some(Color::Pink)),
                    Cell::new(x, 2, false, Some(Color::Pink)),
                    Cell::new(x+1, 1, false, Some(Color::Pink)),
                ],
            }
        }
    }
}
