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
            var self = this;
            $.each(block.squares, function(key, square) {
                self.theMatrix[square.y][square.x].occupied = true;
                self.theMatrix[square.y][square.x].color = block.color;
            });
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
                ctx.clearRect(0, 0, self.getCanvasWidth(), self.getCanvasHeight());
                //render the matrix
                $.each(self.theMatrix, function(rowIndex, row) {
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
            $(document).unbind('keydown'); //@2do: get this into a method unbindControls()
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
        var shape = Math.round(Math.random()*3),
            grid = this.grid,
            startAtX = (grid.widthInSquares/2 - 1),
            block = {
                squares: [],
                color: null,
                leftest: false,
                rightest: false,
                grounded: false
            };
        switch(shape) {
            case 0:
                //square
                block.squares.push({
                    x: startAtX,
                    y: 0
                });
                block.squares.push({
                    x: startAtX + 1,
                    y: 0
                });
                block.squares.push({
                    x: startAtX,
                    y: 1
                });
                block.squares.push({
                    x: startAtX + 1,
                    y: 1
                });
                block.color = 'rgb(150,0,160)';
                break;
            case 1:
                //column
                block.squares.push({
                    x: startAtX,
                    y: 0
                });
                block.squares.push({
                    x: startAtX,
                    y: 1
                });
                block.squares.push({
                    x: startAtX,
                    y: 2
                });
                block.squares.push({
                    x: startAtX,
                    y: 3
                });
                block.color = 'rgb(0,150,0)';
                break;
            case 2:
                //Left L
                block.squares.push({
                    x: startAtX,
                    y: 0
                });
                block.squares.push({
                    x: startAtX,
                    y: 1
                });
                block.squares.push({
                    x: startAtX,
                    y: 2
                });
                block.squares.push({
                    x: startAtX - 1,
                    y: 2
                });
                block.color = 'rgb(0,0,150)';
                break;
            case 3:
                //Right L
                block.squares.push({
                    x: startAtX,
                    y: 0
                });
                block.squares.push({
                    x: startAtX,
                    y: 1
                });
                block.squares.push({
                    x: startAtX,
                    y: 2
                });
                block.squares.push({
                    x: startAtX + 1,
                    y: 2
                });
                block.color = 'rgb(210,180,0)';
                break;
        }
        if (this.collides(block)) throw 'oh noes!';

        return block;
    },
    collides: function(block, onNextDown) {
        //checks whether the block collides with stuff already in the matrix
        var result = false,
            modifier = (onNextDown) ? 1 : 0;
        $.each(block.squares, function(key, square) {
            if(vectris.grid.theMatrix[square.y + modifier][square.x].occupied) {
                result = true;
            }
        });
        return result;
    },
    getGroundStatus: function (block) {
        if (block.squares[3].y === vectris.grid.heightInSquares-1 || vectris.collides(block, true)) {
            //I use the fourth square here because it's the lowest possible square
            block.grounded = true;
        }
    },
    move: {
        left: function(block) {
            if (!block.leftest){
                $.each(block.squares, function(key, square) {
                    square.x--;
                });
                if (block.squares[0].x === 0) {
                    block.leftest = true;
                }
                block.rightest = false;
            }
        },
        right: function(block) {
            if (!block.rightest){
                $.each(block.squares, function(key, square) {
                    square.x++;
                });
                if (block.squares[1].x === vectris.grid.widthInSquares-1) {
                    block.rightest = true;
                }
                block.leftest = false;
            }
        },
        down: function(block) {
            if (!block.grounded) {
                $.each(block.squares, function(key, square) {
                    square.y++;
                });
                vectris.getGroundStatus(block);
            }
        },
        drop: function(block) {
            console.log('drop!');
        },
        rotate: function(block) {
            console.log('rotate!');
        }
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
            eventObj.preventDefault();
            // console.log(eventObj);
            switch(eventObj.which) {
                case 27: //escape
                    $(document).unbind('keydown');
                    break;
                case 32: //space bar
                    vectris.move.drop(newBlock);
                    break;
                case 37: //left arrow
                    vectris.move.left(newBlock);
                    break;
                case 38: //up arrow
                    vectris.move.rotate(newBlock);
                    break;
                case 39: //right arrow
                    vectris.move.right(newBlock);
                    break;
                case 40: //down arrow
                    vectris.move.down(newBlock);
                    break;
            }
            vectris.grid.renderTheMatrix(newBlock);
            if (newBlock.grounded) {
                vectris.grid.updateTheMatrix(newBlock);
                newBlock = vectris.createBlock();
                console.log(vectris.grid.theMatrix);
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