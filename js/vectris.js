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
            for(var i = 0; i < this.heightInSquares; i++) {
                for(var j = 0; j < this.widthInSquares; j++) {
                    row.push({
                        occupied: false,
                        color: undefined
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
                squareSize = this.squaresLength
                startAtX = undefined,
                startAtY = undefined;

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
        //initialize canvas
        this.initGameCanvas();
        //initialize menus
        this.initMainMenu();
        this.initInGameMenu();
        //show starting section
        $('#splash').show();
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
            $('#splash').hide();
            $('#game').show();
            self.play();
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
            $('#splash').show();
        });
    },
    initGameCanvas: function() {
        var canvas = $('#game canvas')[0];
        canvas.width = this.grid.getCanvasWidth();
        canvas.height = this.grid.getCanvasHeight();
    },
    createBlock: function() {
        var shape = Math.floor(Math.random()),
            grid = this.grid,
            startAtX = (grid.widthInSquares/2 - 1),
            block = {
                squares: [],
                color: undefined,
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
                block.color = 'rgb(200,0,200)'
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
                block.color = 'rgb(0,200,0)'
                break;
        }
        if(this.collides(block)) throw 'oh noes!';

        return block;
    },
    collides: function(block) {
        //checks whether the block collides with stuff already in the matrix
        //@2do: evaluate borders and floor!
        var self = this;
        $.each(block.squares, function(key, square) {
            if(self.grid.theMatrix[square.y][square.x].occupied) {
                block.grounded = true;
                return true;
            }
        });
        return false;
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
            $.each(block.squares, function(key, square) {
                square.y++;
            });
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
            chronos = undefined;
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
            /* OBSOLETE
            if(self.collides(newBlock)) {
                self.grid.updateTheMatrix(newBlock); //@do: -1y
                console.log(self.grid.theMatrix);
                floored = true;
            }*/
            vectris.grid.renderTheMatrix(newBlock);
        });
        console.log(vectris.grid.theMatrix);
    },
    gameOverStuff: function() {
        console.error('Game Over!');
    }
}


$(document).ready(function() {
    vectris.init();
})