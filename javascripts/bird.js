var GRAVITY = 5;
var BIRD_COLOR = "red";
var BIRD_SIZE = 60;
var UPFLAP = -10;

function Bird(x, y){
  this.x = x;
  this.y = y;
  this.vel = 0;
}

Bird.prototype = {
  tick: function(context) {
    this.move();
    this.draw(context);
  },
  move: function() {
    this.y += this.vel;
    this.vel = this.vel + GRAVITY;
  },
  draw: function(context) {
    context.fillStyle = BIRD_COLOR;
    context.beginPath();
    context.rect(this.x, this.y, BIRD_SIZE, BIRD_SIZE);
    context.fill();
  },
  flap: function() {
    this.vel = UPFLAP;
    console.log("flapping!");
  },
  getBounds: function(){
    var bounds = {topLeft: [this.x, this.y], bottomRight: [(this.x + BIRD_SIZE), (this.y + BIRD_SIZE)]}
    return bounds;
  },
}