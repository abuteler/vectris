var vectris = {
    grid: {
        widthInSquares: 10,
        heightInSquares: 16,
        squaresMargin: 1,
        squaresLength: 25,
        theMatrix: [],
        getCanvasWidth: function() {
            return this.widthInSquares * this.getGridUnitLength();
        },
        getCanvasHeight: function() {
            return this.heightInSquares * this.getGridUnitLength();
        },
        getGridUnitLength: function() {
            return this.squaresLength + this.squaresMargin * 2;
        },
        initializeTheMatrix: function() {
            var row = [];
            vectris.grid.theMatrix = [];
            for(var i = 0; i < this.heightInSquares; i++) {
                for(var j = 0; j < this.widthInSquares; j++) {
                    row.push({
                        occupied: false,
                        color: null
                    });
                }
                this.theMatrix.push(row);
                row = [];
            }
        },
        updateTheMatrix: function(block) {
            var counter = null,
                linesToCheck = [];
            $.each(block.squares, function(key, square) {
                vectris.grid.theMatrix[square.y][square.x].occupied = true;
                vectris.grid.theMatrix[square.y][square.x].color = block.color;
                //check for completed lines
                if (linesToCheck.indexOf(square.y) === -1) {
                    linesToCheck.push(square.y);
                }
            });
            $.each(linesToCheck, function(key, line) {
                counter = 0;
                $.each(vectris.grid.theMatrix[line], function(key, square) {
                    counter += square.occupied ? 1 : 0;
                });
                if (counter === vectris.grid.widthInSquares) {
                    console.log('rock!');
                }
            });
        },
        renderTheMatrix: function(block) {
            var canvas = $('#game canvas')[0],
                ctx = null,
                startAtX = null,
                startAtY = null,
                squareSize = this.squaresLength;
            if(!canvas.getContext) {
                console.error('No canvas support!');
            } else {
                ctx = canvas.getContext('2d');
                //clear the canvas
                ctx.clearRect(0, 0, vectris.grid.getCanvasWidth(), vectris.grid.getCanvasHeight());
                //render the matrix
                $.each(vectris.grid.theMatrix, function(rowIndex, row) {
                    $.each(row, function(cellIndex, cell) {
                        if(cell.occupied) {
                            ctx.fillStyle = cell.color;
                            //calculate coordinates
                            startAtX = cellIndex * vectris.grid.getGridUnitLength();
                            startAtY = rowIndex * vectris.grid.getGridUnitLength();
                            ctx.fillRect(startAtX, startAtY, squareSize, squareSize);
                        }
                    });
                });
                //render the block that is still free
                $.each(block.squares, function(key, square) {
                    ctx.fillStyle = block.color;
                    //calculate coordinates
                    startAtX = square.x * vectris.grid.getGridUnitLength();
                    startAtY = square.y * vectris.grid.getGridUnitLength();
                    ctx.fillRect(startAtX, startAtY, squareSize, squareSize);
                });
            }
        }
    },
    init: function() {
        var section = (window.location.toString().indexOf('?') === -1) ? 'main' : 'game';
        //initialize canvas
        this.initGameCanvas();
        //initialize menus
        this.initMainMenu();
        this.initInGameMenu();
        //show starting section
        $('#'+section).show();

        //dev mode: skip the menu
        if (section === 'game')
            vectris.play();
    },
    initMainMenu: function() {
        //set hover behaviour
        $('#main-menu li').mouseover(function() {
            $(this).toggleClass('hover');
        });
        $('#main-menu li').mouseout(function() {
            $(this).toggleClass('hover');
        });
        //set buttons behaviour
        $('#btn-play').click(function() {
            $('#main').hide();
            $('#game').show();
            vectris.play();
        });
    },
    initInGameMenu: function() {
        //set hover behaviour
        $('#in-game-menu li').mouseover(function() {
            $(this).toggleClass('hover');
        });
        $('#in-game-menu li').mouseout(function() {
            $(this).toggleClass('hover');
        });
        //set buttons behaviour
        $('#btn-quit').click(function() {
            vectris.unbindControls();
            $('#game').hide();
            $('#main').show();
        });
    },
    initGameCanvas: function() {
        var canvas = $('#game canvas')[0];
        canvas.width = this.grid.getCanvasWidth();
        canvas.height = this.grid.getCanvasHeight();
    },
    createBlock: function() {
        var shape = Math.round(Math.random()*5),
            grid = this.grid,
            startAtX = (grid.widthInSquares/2 - 1),
            block = {
                squares: [],
                color: null,
                leftest: false,
                rightest: false,
                grounded: false,
                frozen: false
            },
            makeSquare = function (x, y) {
                return {x: x, y: y};
            };
        switch(shape) {
            case 0:
                //square
                block.squares.push(makeSquare(startAtX, 0));
                block.squares.push(makeSquare(startAtX + 1, 0));
                block.squares.push(makeSquare(startAtX, 1));
                block.squares.push(makeSquare(startAtX + 1, 1));
                block.color = 'rgb(150,0,160)';
                break;
            case 1:
                //column
                block.squares.push(makeSquare(startAtX, 0));
                block.squares.push(makeSquare(startAtX, 1));
                block.squares.push(makeSquare(startAtX, 2));
                block.squares.push(makeSquare(startAtX, 3));
                block.color = 'rgb(0,150,0)';
                break;
            case 2:
                //Left L
                block.squares.push(makeSquare(startAtX, 0));
                block.squares.push(makeSquare(startAtX, 1));
                block.squares.push(makeSquare(startAtX, 2));
                block.squares.push(makeSquare(startAtX - 1, 2));
                block.color = 'rgb(0,0,180)';
                break;
            case 3:
                //Right L
                block.squares.push(makeSquare(startAtX, 0));
                block.squares.push(makeSquare(startAtX, 1));
                block.squares.push(makeSquare(startAtX, 2));
                block.squares.push(makeSquare(startAtX + 1, 2));
                block.color = 'rgb(210,180,0)';
                break;
            case 4:
                //Left "lightning"
                block.squares.push(makeSquare(startAtX, 0));
                block.squares.push(makeSquare(startAtX, 1));
                block.squares.push(makeSquare(startAtX - 1, 1));
                block.squares.push(makeSquare(startAtX - 1, 2));
                block.color = 'rgb(180,0,0)';
                break;
            case 5:
                //Right lightning
                block.squares.push(makeSquare(startAtX, 0));
                block.squares.push(makeSquare(startAtX, 1));
                block.squares.push(makeSquare(startAtX + 1, 1));
                block.squares.push(makeSquare(startAtX + 1, 2));
                block.color = 'rgb(170,210,230)';
                break;
        }
        if (vectris.antiCollisionSystem(block).collided) {
            throw 'oh noes!';
        }
        return block;
    },
    //checks and sets block boundaries and collision with stuff already in the matrix
    antiCollisionSystem: function(block) {
        var result = false;
        //reset boundaries after a move
        block.leftest = false;
        block.rightest = false;
        block.grounded = false;
        try {
            $.each(block.squares, function(key, square) {
                //check for possible overflowing in rotation and correct it
                if (square.x < 0) {
                    vectris.move.right(block);
                } else if (square.x > vectris.grid.widthInSquares-1) {
                    vectris.move.left(block);
                }
                if (square.y < 0) {
                    vectris.move.down(block);
                }
                if (square.y > vectris.grid.heightInSquares-1) {
                    vectris.move.up(block);
                }
                //check for overlapping (should only happen on creation)
                if (vectris.grid.theMatrix[square.y][square.x].occupied) {
                    result = true;
                }
                //check for left boundaries
                if (square.x === 0 || vectris.grid.theMatrix[square.y][square.x - 1].occupied) {
                    block.leftest = true;
                }
                //right boundaries
                if (square.x === vectris.grid.widthInSquares-1 || vectris.grid.theMatrix[square.y][square.x + 1].occupied) {
                    block.rightest = true;
                }
                //ground boundaries
                if (square.y === vectris.grid.heightInSquares-1 || vectris.grid.theMatrix[square.y + 1][square.x].occupied) {
                    block.grounded = true;
                }
            });
        } catch (e) {
            // console.log(e);
            result = true;
        }
        return {collided: result};
    },
    move: {
        left: function(block) {
            if (!block.leftest){
                $.each(block.squares, function(key, square) {
                    square.x--;
                });
                vectris.antiCollisionSystem(block);
            }
        },
        right: function(block) {
            if (!block.rightest){
                $.each(block.squares, function(key, square) {
                    square.x++;
                });
                vectris.antiCollisionSystem(block);
            }
        },
        up: function(block) {
            //I don't expect to use this one other than in the correction of rotations
            $.each(block.squares, function(key, square) {
                square.y--;
            });
        },
        down: function(block) {
            if (!block.grounded) {
                $.each(block.squares, function(key, square) {
                    square.y++;
                });
                vectris.antiCollisionSystem(block);
            } else {
                //once it's grounded one next down will freeze it in place
                block.frozen = true;
            }
        },
        drop: function(block) {
            while (!block.frozen) {
                vectris.move.down(block);
            }
        },
        rotate: function(block) {
            //in case the rotation leaves the block helplessly overflowing, i will rotate a clone first
            var clone = $.extend(true, {}, block),
                newOrigin = null,
                aux = null;
            //first I set the second square as my origin coordinates
            newOrigin = { x: clone.squares[1].x, y: clone.squares[1].y };

            $.each(clone.squares, function (key, square) {
                square.x -= newOrigin.x;
                square.y -= newOrigin.y;
                //^note that square[1] will end up being (0,0)
                //then I do the Linear Transformation (-y, x), which rotates 90 degrees counter clockwise
                //See http://en.wikipedia.org/wiki/Transformation_matrix#Examples_in_2D_graphics for additional reference
                aux = square.x;
                square.x = -square.y;
                square.y = aux;
                //finally, I put the block back where it was in the matrix, only rotated
                square.x += newOrigin.x;
                square.y += newOrigin.y;
            });
            //now I need to check that the new coordinates haven't overflowed the matrix
            //if they have, the anti collision system will pull the block back in, where possible,
            //or prevent the rotation
            if (!vectris.antiCollisionSystem(clone).collided) {
                $.extend(true, block, clone);
            }
        }
    },
    unbindControls: function() {
        $(document).unbind('keydown');
    },
    play: function() {
        var newBlock = {},
            gameOver = false,
            floored = false,
            chronos = null;
        //initialize game matrix
        vectris.grid.initializeTheMatrix();
        //rock and roll!

        /* MUST RETHINK
        while (!gameOver){
         try {
            newBlock = this.createBlock();
            self.grid.renderTheMatrix(newBlock);
            console.log(newBlock);
                  console.log('floored i '+floored);
            while (!floored) {
                  console.log('floored j '+floored);

                  
                  
               chronos = setTimeout(function(){
                  console.log('floored'+floored);
                  self.grid.renderTheMatrix(newBlock);
                  self.move.down(newBlock);
                  if (self.collides(newBlock)){
                     floored = true;
                     self.grid.updateTheMatrix(newBlock); //@do: -1y
                     clearInterval(chronos);
                  }
               }, 1200);
            }
            // clearInterval(chronos);
         } catch (err) {
            // console.log(err);
            gameOver = true;
            //last render
            self.grid.renderTheMatrix(newBlock);
            self.gameOverStuff();
         }
      }*/
        newBlock = vectris.createBlock();
        vectris.grid.renderTheMatrix(newBlock);
        //initialize controls
        $(document).keydown(function(eventObj) {
            switch(eventObj.which) {
                case 27: //escape
                    eventObj.preventDefault();
                    $(document).unbind('keydown');
                    break;
                case 32: //space bar
                    eventObj.preventDefault();
                    vectris.move.drop(newBlock);
                    break;
                case 37: //left arrow
                    eventObj.preventDefault();
                    vectris.move.left(newBlock);
                    break;
                case 38: //up arrow
                    eventObj.preventDefault();
                    vectris.move.rotate(newBlock);
                    break;
                case 39: //right arrow
                    eventObj.preventDefault();
                    vectris.move.right(newBlock);
                    break;
                case 40: //down arrow
                    eventObj.preventDefault();
                    vectris.move.down(newBlock);
                    break;
            }
            vectris.grid.renderTheMatrix(newBlock);
            if (newBlock.frozen) {
                vectris.grid.updateTheMatrix(newBlock);
                try {
                    newBlock = vectris.createBlock();
                } catch (err) {
                    console.log(err);
                    vectris.unbindControls();
                } finally {
                    vectris.grid.renderTheMatrix(newBlock);
                }
            }
        });
    },
    gameOverStuff: function() {
        console.error('Game Over!');
    }
};


$(document).ready(function() {
    vectris.init();
});