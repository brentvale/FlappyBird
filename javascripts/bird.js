var GRAVITY = 0.2;
var BIRD_SIZE = 30;
var UPFLAP = -5;
var DRAGON_FLAP_DELAY = 4;

function Bird(x, y){
  this.x = x;
  this.y = y;
  this.vel = 0;
  this.loadResource();
  this.drawCount = 0;
  this.drawDelay = DRAGON_FLAP_DELAY;
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
    if(this.drawDelay === 0){
      this.drawCount += 1;
      this.drawDelay = DRAGON_FLAP_DELAY;
    } else {
      this.drawDelay--;
    }
    var x = (this.drawCount % 7) * 100;
    context.drawImage(
      this.dragonImage, 
      x,0,100,100,
      this.x, this.y,50,50
    )
  },
  flap: function() {
    this.vel = UPFLAP;
    //reset draw count to zero if flap is clicked
    this.drawCount = 0;
  },
  getBounds: function(){
    var bounds = {topLeft: [this.x, this.y], bottomRight: [(this.x + BIRD_SIZE), (this.y + BIRD_SIZE)]}
    return bounds;
  },
  loadResource: function(){
    this.dragonImage = new Image();
    this.dragonImage.src = "images/dragon_yellow.png"
  },
}