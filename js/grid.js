var Grid = function () {
    this.widthInSquares = 10;
    this.heightInSquares = 16;
    this.squaresMargin = 1;
    this.squaresLength = 25;
    this.theMatrix = null;
};

Grid.prototype.getCanvasWidth = function() {
    return this.widthInSquares * this.getGridUnitLength();
};

Grid.prototype.getCanvasHeight = function() {
    return this.heightInSquares * this.getGridUnitLength();
};

Grid.prototype.getGridUnitLength = function() {
    return this.squaresLength + this.squaresMargin * 2;
};

Grid.prototype.createRow = function() {
    var row = [];
    for(var i = 0; i < this.widthInSquares; i++) {
        row.push({
            occupied: false,
            color: null
        });
    }
    return row;
};

Grid.prototype.initializeTheMatrix = function() {
    this.theMatrix = [];
    for(var i = 0; i < this.heightInSquares; i++) {
        this.theMatrix.push(this.createRow());
    }
};

Grid.prototype.updateTheMatrix = function(block) {
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
};

Grid.prototype.getLinesCompleted = function(linesToCheck){
    var that = this,
        completed = [];
    $.each(linesToCheck, function(key, line) {
        if (that.isLineComplete(line)) {
            completed.push(line);
        }
    });

    return completed;
};

Grid.prototype.isLineComplete = function(line){
    var counter = 0,
        result = null;
    $.each(this.theMatrix[line], function(key, square) {
        counter += square.occupied ? 1 : 0;
    });
    result = (counter === this.widthInSquares) ? true : false;

    return result;
};

Grid.prototype.burnLines = function(lines) {
    var that = this,
        removed = null;
    // console.log(lines);
    $.each(lines, function(index, lineNumber) {
        // that.renderLineToBurn(lineNumber);
        that.paintLineToBurn(lineNumber);
        setTimeout(function(){
            //remove the line from the matrix
            removed = that.theMatrix.splice(lineNumber, 1);
            //refill the matrix
            that.theMatrix.unshift(that.createRow());
            that.renderTheMatrix(vectris.currentBlock);
        }, 300);
    });
    vectris.burnedLines += lines.length;
    //update score
    $('#score').html(vectris.burnedLines);
};

Grid.prototype.paintLineToBurn = function(line) {
    $.each(this.theMatrix[line], function(key, cell){
        cell.color = 'rgb(30,10,30)';
    });
};

Grid.prototype.renderTheMatrix = function(block) {
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
};

Grid.prototype.renderNextBlock = function(block) {
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
};

/* Deprecated */
Grid.prototype.renderLineToBurn = function(lineNumber) {
    var that = this,
        canvas = $('#game canvas')[0],
        ctx = null,
        startAtX = null,
        startAtY = null,
        squareSize = this.squaresLength
        cellX = 0;
    if(!canvas.getContext) {
        console.error('No canvas support!');
    } else {
        ctx = canvas.getContext('2d');
        //render the line as burned
        $.each(this.theMatrix[lineNumber], function(cellIndex, cell) {
            ctx.fillStyle = 'rgb(70,10,70)';
            //calculate coordinates
            startAtX = cellX * that.getGridUnitLength();
            startAtY = lineNumber * that.getGridUnitLength();
            ctx.fillRect(startAtX, startAtY, squareSize, squareSize);
            cellX++;
        });
    }
};
/* *************** */