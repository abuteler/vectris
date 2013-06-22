var Moves = function () {};

Moves.prototype.left = function() {
    var block = vectris.currentBlock;
    if (!block.leftest){
        $.each(block.squares, function(key, square) {
            square.x--;
        });
        vectris.antiCollisionSystem(block);
    }
};

Moves.prototype.right = function() {
    var block = vectris.currentBlock;
    if (!block.rightest){
        $.each(block.squares, function(key, square) {
            square.x++;
        });
        vectris.antiCollisionSystem(block);
    }
};

Moves.prototype.up = function() {
    var block = vectris.currentBlock;
    //I don't expect to use this one other than in the correction of rotations
    $.each(block.squares, function(key, square) {
        square.y--;
    });
};

Moves.prototype.down = function() {
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
};

Moves.prototype.drop = function() {
    var block = vectris.currentBlock;
    while (!block.frozen) {
        vectris.move.down();
    }
};

Moves.prototype.rotate = function() {
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
};
