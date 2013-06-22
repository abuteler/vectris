var vectris = {
    burnedLines: null,
    currentBlock: null,
    nextBlock: null,
    paused: false,
    grid: new Grid(),
    move: new Moves(),
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
                $('.paused-box').hide();
                that.bindControls();
                that.startGravity();
                that.paused = false;
            } else {
                $('.paused-box').show();
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
        var paused = $('#btn-pause').hasClass('paused')
        
        if (quit) {
            this.burnedLines = null;
            $('#score').html(0);
            this.stopGravity();
            //reset pause if it was on when quit
            if (paused) {
                this.paused = false;
                $('.paused-box').hide();
                $('#btn-pause').toggleClass('paused');
            }
        }
        this.stopGravity();
        this.unbindControls();
        $('.game-over-box').show();
    }
};


$(document).ready(function() {
    vectris.init();
});