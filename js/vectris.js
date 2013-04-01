var vectris = {
    burnedLines: null,
    currentBlock: null,
    grid: {
        widthInSquares: 10,
        heightInSquares: 16,
        squaresMargin: 1,
        squaresLength: 25,
        theMatrix: null,
        getCanvasWidth: function() {
            return this.widthInSquares * this.getGridUnitLength();
        },
        getCanvasHeight: function() {
            return this.heightInSquares * this.getGridUnitLength();
        },
        getGridUnitLength: function() {
            return this.squaresLength + this.squaresMargin * 2;
        },
        createRow: function() {
            var row = [];
            for(var i = 0; i < this.widthInSquares; i++) {
                row.push({
                    occupied: false,
                    color: null
                });
            }
            return row;
        },
        initializeTheMatrix: function() {
            this.theMatrix = [];
            for(var i = 0; i < this.heightInSquares; i++) {
                this.theMatrix.push(this.createRow());
            }
        },
        updateTheMatrix: function(block) {
            var self = this,
                counter = null,
                linesToCheck = [],
                linesToBurn = [];
            $.each(block.squares, function(key, square) {
                self.theMatrix[square.y][square.x].occupied = true;
                self.theMatrix[square.y][square.x].color = block.color;
                //check for completed lines
                if (linesToCheck.indexOf(square.y) === -1) {
                    linesToCheck.push(square.y);
                }
            });
            $.each(linesToCheck, function(key, line) {
                counter = 0;
                $.each(self.theMatrix[line], function(key, square) {
                    counter += square.occupied ? 1 : 0;
                });
                if (counter === self.widthInSquares) {
                    linesToBurn.push(line);
                }
            });
            if (linesToBurn.length > 0) {
                this.burnLines(linesToBurn);
            }
        },
        burnLines: function(lines) {
            var removed = this.theMatrix.splice(lines[0], lines.length);
            vectris.burnedLines += lines.length;
            for (var i = 0; i < lines.length; i++) {
                this.theMatrix.unshift(this.createRow());
            }
            //update score
            $('#score').html(vectris.burnedLines);
        },
        renderTheMatrix: function(block) {
            var self = this,
                canvas = $('#game canvas')[0],
                ctx = null,
                startAtX = null,
                startAtY = null,
                squareSize = this.squaresLength;
            if(!canvas.getContext) {
                console.error('No canvas support!');
            } else {
                ctx = canvas.getContext('2d');
                //clear the canvas
                ctx.clearRect(0, 0, this.getCanvasWidth(), this.getCanvasHeight());
                //render the matrix
                $.each(this.theMatrix, function(rowIndex, row) {
                    $.each(row, function(cellIndex, cell) {
                        if(cell.occupied) {
                            ctx.fillStyle = cell.color;
                            //calculate coordinates
                            startAtX = cellIndex * self.getGridUnitLength();
                            startAtY = rowIndex * self.getGridUnitLength();
                            ctx.fillRect(startAtX, startAtY, squareSize, squareSize);
                        }
                    });
                });
                //render the block that is still free
                $.each(block.squares, function(key, square) {
                    ctx.fillStyle = block.color;
                    //calculate coordinates
                    startAtX = square.x * self.getGridUnitLength();
                    startAtY = square.y * self.getGridUnitLength();
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
            this.play();
    },
    initMainMenu: function() {
        var self = this;
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
            self.play();
        });
    },
    initInGameMenu: function() {
        var self = this;
        //set hover behaviour
        $('#in-game-menu li').mouseover(function() {
            $(this).toggleClass('hover');
        });
        $('#in-game-menu li').mouseout(function() {
            $(this).toggleClass('hover');
        });
        //set buttons behaviour
        $('#btn-quit').click(function() {
            self.gameOverStuff(true);
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
                frozen: false,
                rotatable: true
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
                block.rotatable = false;
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
        if (this.antiCollisionSystem(block).collided) {
            throw { block: block, error: 'oh noes!' };
        }
        return block;
    },
    //checks and sets block boundaries and collision with stuff already in the matrix
    antiCollisionSystem: function(block) {
        var self = this,
            result = false;
        //reset boundaries after a move
        block.leftest = false;
        block.rightest = false;
        block.grounded = false;
        try {
            $.each(block.squares, function(key, square) {
                //check for possible overflowing in rotation and correct it
                if (square.x < 0) {
                    self.move.right(block);
                } else if (square.x > self.grid.widthInSquares-1) {
                    self.move.left(block);
                }
                if (square.y < 0) {
                    self.move.down(block);
                }
                if (square.y > self.grid.heightInSquares-1) {
                    self.move.up(block);
                }
                //check for overlapping (should only happen on creation)
                if (self.grid.theMatrix[square.y][square.x].occupied) {
                    result = true;
                }
                //check for left boundaries
                if (square.x === 0 || self.grid.theMatrix[square.y][square.x - 1].occupied) {
                    block.leftest = true;
                }
                //right boundaries
                if (square.x === self.grid.widthInSquares-1 || self.grid.theMatrix[square.y][square.x + 1].occupied) {
                    block.rightest = true;
                }
                //ground boundaries
                if (square.y === self.grid.heightInSquares-1 || self.grid.theMatrix[square.y + 1][square.x].occupied) {
                    block.grounded = true;
                }
            });
        } catch (e) {
            //@2Do: check whether this try .. catch is used. I think not anymore.
            // console.log(e);
            result = true;
        }
        return {collided: result};
    },
    move: {
        left: function() {
            var block = vectris.currentBlock;
            if (!block.leftest){
                $.each(block.squares, function(key, square) {
                    square.x--;
                });
                vectris.antiCollisionSystem(block);
            }
        },
        right: function() {
            var block = vectris.currentBlock;
            if (!block.rightest){
                $.each(block.squares, function(key, square) {
                    square.x++;
                });
                vectris.antiCollisionSystem(block);
            }
        },
        up: function() {
            var block = vectris.currentBlock;
            //I don't expect to use this one other than in the correction of rotations
            $.each(block.squares, function(key, square) {
                square.y--;
            });
        },
        down: function() {
            var block = vectris.currentBlock;
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
        drop: function() {
            var block = vectris.currentBlock;
            while (!block.frozen) {
                vectris.move.down();
            }
        },
        rotate: function() {
            var block = vectris.currentBlock;
            if (block.rotatable) {
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
        }
    },
    nextBlock: function() {
        //updates the matrix with last block and creates new one, or throws error via this.createBlock();
        this.grid.updateTheMatrix(this.currentBlock);
        newBlock = this.createBlock();
        return newBlock;
    },
    updateGameStatusAfterMove: function() {
        console.log('aaa');
        this.grid.renderTheMatrix(this.currentBlock);
        if (this.currentBlock.frozen) {
            try {
                this.currentBlock = this.nextBlock();
            } catch (err) {
                console.log(err.error);
                this.currentBlock = err.block;
                this.gameOverStuff();
            } finally {
                this.grid.renderTheMatrix(this.currentBlock);
            }
        }
    },
    bindControls: function() {
        var self = this,
            gameKeyPressed = null;
        $(document).keydown(function(eventObj) {
            gameKeyPressed = true;
            switch(eventObj.which) {
                case 27: //escape
                    // eventObj.preventDefault();
                    // $(document).unbind('keydown');
                    break;
                case 32: //space bar
                    eventObj.preventDefault();
                    self.move.drop();
                    break;
                case 37: //left arrow
                    eventObj.preventDefault();
                    self.move.left();
                    break;
                case 38: //up arrow
                    eventObj.preventDefault();
                    self.move.rotate();
                    break;
                case 39: //right arrow
                    eventObj.preventDefault();
                    self.move.right();
                    break;
                case 40: //down arrow
                    eventObj.preventDefault();
                    self.move.down();
                    break;
                default:
                    gameKeyPressed = false;
                    break;
            };
            if(gameKeyPressed) {
                self.updateGameStatusAfterMove();
            }
        });
    },
    unbindControls: function() {
        $(document).unbind('keydown');
    },
    play: function() {
        var self = this,
            newBlock = {},
            gameOver = false,
            floored = false,
            chronos = null;
        //initialize game matrix
        this.grid.initializeTheMatrix();
        //initialize burnedLines
        this.burnedLines = 0;

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
        this.currentBlock = this.createBlock();
        this.grid.renderTheMatrix(this.currentBlock);
        this.bindControls();
        
    },
    gameOverStuff: function(quit) {
        if (quit) {
            this.burnedLines = null;
            $('#score').html(0);
        }
        this.unbindControls();
        console.error('Game Over!');
    }
};


$(document).ready(function() {
    vectris.init();
});