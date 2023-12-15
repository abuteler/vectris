var Gravity = function () {
    this.delayTime = null;
    this.gravityInterval = null;
};

Gravity.prototype.start = function() {
    this.gravityInterval = setInterval(function(){
        vectris.move.down();
        vectris.updateGameStatusAfterMove();
    }, this.delayTime);
};

Gravity.prototype.stop = function() {
    clearInterval(this.gravityInterval);
};

Gravity.prototype.reset = function() {
    this.stop();
    this.start();
};