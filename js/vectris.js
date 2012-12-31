var vectris = {
   grid: {
      widthInSquares: 10,
      heightInSquares: 16,
      squaresMargin: 1,
      squaresLength:25,
      getCanvasWidth: function(){
         return this.widthInSquares*this.getGridUnitLength();
      },
      getCanvasHeight: function(){
         return this.heightInSquares*this.getGridUnitLength();
      },
      getGridUnitLength: function(){
         return this.squaresLength+this.squaresMargin*2;
      }
   },
   init: function() {
      //show starting section
      $('#splash').show();
      //initialize canvas
      this.initGameCanvas();
      //initialize menus
      this.initMainMenu();
      this.initInGameMenu();
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
         self.renderGrid();
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
         $('#game').hide();
         $('#splash').show();
      });
   },
   initGameCanvas: function() {
      var canvas = $('#game canvas')[0];
      canvas.width = this.grid.getCanvasWidth();
      canvas.height = this.grid.getCanvasHeight();
   },
   createBlock: function(){
      var shape = Math.floor(Math.random()),
         grid = this.grid,
         startAtX = (grid.widthInSquares/2-1)*grid.getGridUnitLength(),
         startAtY = grid.squaresMargin,
         next = grid.squaresLength + grid.squaresMargin*2,
         block = {
            squares: [],
            color: ''
         };
      switch (shape) {
         case 0: //square
            block.squares.push([startAtX, startAtY]);
            block.squares.push([startAtX+next, startAtY]);
            block.squares.push([startAtX, startAtY+next]);
            block.squares.push([startAtX+next, startAtY+next]);
            block.color = 'rgb(200,0,200)'
            break;
         case 1: //column
            block.squares.push([startAtX, startAtY]);
            block.squares.push([startAtX, startAtY+next]);
            block.squares.push([startAtX, startAtY+next*2]);
            block.squares.push([startAtX, startAtY+next*3]);
            block.color = 'rgb(0,200,0)'
            break;
      }
      return block;
   },
   renderGrid: function(){
      var canvas = $('#game canvas')[0],
         ctx = null,
         blockSize = this.grid.squaresLength;
         block = this.createBlock();
      if (!canvas.getContext){
         console.error('No canvas support!');
      } else {
         //Render
         ctx = canvas.getContext('2d');
         ctx.fillStyle = block.color;
         $.each(block.squares, function(key, square){
            console.log(blockSize);
            ctx.fillRect(square[0], square[1], blockSize, blockSize);
         });
      }
   }
}


$(document).ready(function() {
   vectris.init();
})