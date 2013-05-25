var vectris = {
    burnedLines: null,
    currentBlock: null,
    nextBlock: null,
    paused: false,
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
            var that = this,
                counter = null,
                linesToCheck = [],
                linesToBurn = [];
            $.each(block.squares, function(key, square) {
                that.theMatrix[square.y][square.x].occupied = true;
                that.theMatrix[square.y][square.x].color = block.color;
                //get unique vertical coordinates
                if (linesToCheck.indexOf(square.y) === -1) {
                    linesToCheck.push(square.y);
                }
            });
            linesToBurn = this.getLinesCompleted(linesToCheck);
            if (linesToBurn.length > 0) {
                this.burnLines(linesToBurn);
            }
        },
        getLinesCompleted: function(linesToCheck){
            var that = this,
                completed = [];
            $.each(linesToCheck, function(key, line) {
                if (that.isLineComplete(line)) {
                    completed.push(line);
                }
            });

            return completed;
        },
        isLineComplete: function(line){
            var counter = 0,
                result = null;
            $.each(this.theMatrix[line], function(key, square) {
                counter += square.occupied ? 1 : 0;
            });
            result = (counter === this.widthInSquares) ? true : false;

            return result;
        },
        burnLines: function(lines) {
            var that = this,
                removed = null;
            // console.log(lines);
            $.each(lines, function(index, lineNumber) {
                //that.renderLineToBurn(lineNumber);
                // vectris.stopGravity();
                // console.log(this.theMatrix);
                removed = that.theMatrix.splice(lineNumber, 1);
                // console.log(removed);
            });
            //refill the matrix with as many lines were burned
            for (var i = 0; i < lines.length; i++) {
                this.theMatrix.unshift(this.createRow());
            }
            vectris.burnedLines += lines.length;
            //update score
            $('#score').html(vectris.burnedLines);
        },
        renderTheMatrix: function(block) {
            var that = this,
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
                            startAtX = cellIndex * that.getGridUnitLength();
                            startAtY = rowIndex * that.getGridUnitLength();
                            ctx.fillRect(startAtX, startAtY, squareSize, squareSize);
                        }
                    });
                });
                //render the block that is still free
                $.each(block.squares, function(key, square) {
                    ctx.fillStyle = block.color;
                    //calculate coordinates
                    startAtX = square.x * that.getGridUnitLength();
                    startAtY = square.y * that.getGridUnitLength();
                    ctx.fillRect(startAtX, startAtY, squareSize, squareSize);
                });
            }
        },
        renderLineToBurn: function(lineNumber) {
            var that = this,
                canvas = $('#game canvas')[0],
                ctx = null,
                startAtX = null,
                startAtY = null,
                squareSize = this.squaresLength;
            if(!canvas.getContext) {
                console.error('No canvas support!');
            } else {
                ctx = canvas.getContext('2d');
                
                //render the line as burned
                $.each(this.theMatrix[lineNumber], function(cellIndex, cell) {
                    ctx.fillStyle = 'rgb(70,10,70)';
                    //calculate coordinates
                    startAtX = square.x * that.getGridUnitLength();
                    startAtY = square.y * that.getGridUnitLength();
                    ctx.fillRect(startAtX, startAtY, squareSize, squareSize);
                });
            }
        },
        renderNextBlock: function(block) {
            var that = this,
                canvas = $('#game .game-ui .next-block-box canvas')[0],
                ctx = null,
                startAtX = null,
                startAtY = null,
                squareSize = this.squaresLength;
            if(!canvas.getContext) {
                console.error('No canvas support!');
            } else {
                ctx = canvas.getContext('2d');
                //set canvas dimensions
                canvas.width = this.getGridUnitLength()*4;
                canvas.height = this.getGridUnitLength()*6;
                //clear the canvas
                ctx.fillStyle = 'rgb(245,248,245)';
                ctx.fillRect(0, 0, this.getGridUnitLength()*4, this.getGridUnitLength()*6);
                // ctx.clearRect(0, 0, this.getGridUnitLength()*3, this.getGridUnitLength()*5);
                //render the block
                $.each(block.squares, function(key, square) {
                    ctx.fillStyle = block.color;
                    //calculate coordinates
                    startAtX = (square.x - (that.widthInSquares/2-2) ) * that.getGridUnitLength();
                    startAtY = (square.y + 1) * that.getGridUnitLength();
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
        var that = this;
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
            that.play();
        });
    },
    initInGameMenu: function() {
        var that = this;
        //set hover behaviour
        $('#in-game-menu li').mouseover(function() {
            $(this).toggleClass('hover');
        });
        $('#in-game-menu li').mouseout(function() {
            $(this).toggleClass('hover');
        });
        //set buttons behaviour
        $('#btn-pause').click(function() {
            if (that.paused) {
                that.bindControls();
                that.startGravity();
                that.paused = false;
            } else {
                that.stopGravity();
                that.paused = true;
                that.unbindControls();
            }
            $(this).toggleClass('paused');
        });
        $('#btn-quit').click(function() {
            that.gameOverStuff(true);
            $('#game').hide();
            $('.game-over-box').hide();
            $('#main').show();
        });
    },
    initGameCanvas: function() {
        var canvas = $('#game canvas')[0];
        canvas.width = this.grid.getCanvasWidth();
        canvas.height = this.grid.getCanvasHeight();
    },
    createBlock: function() {
        var shape = Math.round(Math.random()*6),
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
                block.squares.push(makeSquare(startAtX+1, 0));
                block.squares.push(makeSquare(startAtX, 1));
                block.squares.push(makeSquare(startAtX+1, 1));
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
                block.squares.push(makeSquare(startAtX+1, 0));
                block.squares.push(makeSquare(startAtX+1, 1));
                block.squares.push(makeSquare(startAtX+1, 2));
                block.squares.push(makeSquare(startAtX, 2));
                block.color = 'rgb(0,0,180)';
                break;
            case 3:
                //Right L
                block.squares.push(makeSquare(startAtX, 0));
                block.squares.push(makeSquare(startAtX, 1));
                block.squares.push(makeSquare(startAtX, 2));
                block.squares.push(makeSquare(startAtX+1, 2));
                block.color = 'rgb(210,180,0)';
                break;
            case 4:
                //Left "lightning"
                block.squares.push(makeSquare(startAtX+1, 0));
                block.squares.push(makeSquare(startAtX+1, 1));
                block.squares.push(makeSquare(startAtX, 1));
                block.squares.push(makeSquare(startAtX, 2));
                block.color = 'rgb(180,0,0)';
                break;
            case 5:
                //Right lightning
                block.squares.push(makeSquare(startAtX, 0));
                block.squares.push(makeSquare(startAtX, 1));
                block.squares.push(makeSquare(startAtX+1, 1));
                block.squares.push(makeSquare(startAtX+1, 2));
                block.color = 'rgb(170,210,230)';
                break;
            case 6:
                //tripod
                block.squares.push(makeSquare(startAtX, 0));
                block.squares.push(makeSquare(startAtX, 1));
                block.squares.push(makeSquare(startAtX, 2));
                block.squares.push(makeSquare(startAtX+1, 1));
                block.color = 'rgb(230,0,200)';
                break;
        }
        return block;
    },
    //checks and sets block boundaries and collision with stuff already in the matrix
    antiCollisionSystem: function(block) {
        var that = this,
            result = false;
        //reset boundaries after a move
        block.leftest = false;
        block.rightest = false;
        block.grounded = false;
        try {
            $.each(block.squares, function(key, square) {
                //check for possible overflowing in rotation and correct it
                if (square.x < 0) {
                    that.move.right(block);
                } else if (square.x > that.grid.widthInSquares-1) {
                    that.move.left(block);
                }
                if (square.y < 0) {
                    that.move.down(block);
                }
                if (square.y > that.grid.heightInSquares-1) {
                    that.move.up(block);
                }
                //check for overlapping (should only happen on creation)
                if (that.grid.theMatrix[square.y][square.x].occupied) {
                    result = true;
                }
                //check for left boundaries
                if (square.x === 0 || that.grid.theMatrix[square.y][square.x - 1].occupied) {
                    block.leftest = true;
                }
                //right boundaries
                if (square.x === that.grid.widthInSquares-1 || that.grid.theMatrix[square.y][square.x + 1].occupied) {
                    block.rightest = true;
                }
                //ground boundaries
                if (square.y === that.grid.heightInSquares-1 || that.grid.theMatrix[square.y + 1][square.x].occupied) {
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
    switchToNextBlock: function() {
        //updates the matrix with current block's position
        this.grid.updateTheMatrix(this.currentBlock);
        //check whether the next block collides with previous blocks in the matrix
        if (this.antiCollisionSystem(this.nextBlock).collided) {
            throw { block: this.nextBlock, error: 'oh noes!' };
        }
        return this.nextBlock;
    },
    updateGameStatusAfterMove: function() {
        this.grid.renderTheMatrix(this.currentBlock);
        if (this.currentBlock.frozen) {
            try {
                this.currentBlock = this.switchToNextBlock();
                this.nextBlock = this.createBlock();
                this.grid.renderNextBlock(this.nextBlock);
            } catch (err) {
                console.log(err.error);
                this.currentBlock = err.block;
                this.gameOverStuff();
            } finally {
                this.grid.renderTheMatrix(this.currentBlock);
            }
        }
    },
    startGravity: function() {
        this.gravity = setInterval(function(){
            vectris.move.down();
            vectris.updateGameStatusAfterMove();
        }, this.gravityDelayTime);
    },
    stopGravity: function() {
        clearInterval(this.gravity);
    },
    resetGravity: function() {
        this.stopGravity();
        this.startGravity();
    },
    bindControls: function() {
        var that = this,
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
                    that.move.drop();
                    vectris.resetGravity();
                    break;
                case 37: //left arrow
                    eventObj.preventDefault();
                    that.move.left();
                    break;
                case 38: //up arrow
                    eventObj.preventDefault();
                    that.move.rotate();
                    break;
                case 39: //right arrow
                    eventObj.preventDefault();
                    that.move.right();
                    break;
                case 40: //down arrow
                    eventObj.preventDefault();
                    that.move.down();
                    vectris.resetGravity();
                    break;
                default:
                    gameKeyPressed = false;
                    break;
            };
            if(gameKeyPressed) {
                that.updateGameStatusAfterMove();
            }
        });
    },
    unbindControls: function() {
        $(document).unbind('keydown');
    },
    play: function() {
        //initialize game matrix
        this.grid.initializeTheMatrix();
        //initialize burnedLines
        this.burnedLines = 0;
        this.gravityDelayTime = 700; //@2Do: implement handicap and progressive difficulty

        //rock and roll!
        this.currentBlock = this.createBlock();
        this.grid.renderTheMatrix(this.currentBlock);
        this.nextBlock = this.createBlock();
        this.grid.renderNextBlock(this.nextBlock);
        this.bindControls();
        this.startGravity();
    },
    gameOverStuff: function(quit) {
        if (quit) {
            this.burnedLines = null;
            $('#score').html(0);
        }
        this.stopGravity();
        this.unbindControls();
        $('.game-over-box').show();
    }
};


$(document).ready(function() {
    vectris.init();
});