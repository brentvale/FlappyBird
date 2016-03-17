var GRAVITY = 0.2;
var BIRD_SIZE = 30;
var UPFLAP = -5;
var DRAGON_FLAP_DELAY = 4;
var STROKE_INDEX = 0;
var STROKE_COLORS_ARRAY = ["#f3f424","#f1f25e","#eff09a","#f0f0c2","#f2f2df"];
//change color once every 10 ticks
var STROKE_COUNTER = 0;

function Bird(x, y, context){
  this.x = x;
  this.y = y;
  this.vel = 0;
  this.loadResource();
  this.drawCount = 0;
  this.drawDelay = DRAGON_FLAP_DELAY;
  this.ctx = context;
  this.pos = true;
}

Bird.prototype = {
  tick: function() {
    this.move();
    this.draw();
  },
  move: function() {
    this.y += this.vel;
    this.vel = this.vel + GRAVITY;
  },
  draw: function() {
    if(this.drawDelay === 0){
      this.drawCount += 1;
      this.drawDelay = DRAGON_FLAP_DELAY;
    } else {
      this.drawDelay--;
    }
    var x = (this.drawCount % 7) * 100;
    
    //draw bounds around dragon as well
    
    var strokeColor = STROKE_COLORS_ARRAY[STROKE_INDEX]
    this.handleStrokeIndex();
    
    this.ctx.strokeStyle = strokeColor;

    this.ctx.beginPath();
    this.ctx.arc((this.x+25), this.y+25, 30, 0, 2*Math.PI);
    this.ctx.stroke();
    
    this.ctx.drawImage(
      this.dragonImage, 
      x,0,100,100,
      this.x, this.y,50,50
    );
    
  },
  //pulsating...color up and color down -> increment and decrement index
  handleStrokeIndex: function(){
    STROKE_COUNTER += 1;
    if(STROKE_COUNTER == 20){
      //reset stroke counter
      STROKE_COUNTER = 0;
      if(this.pos){
        STROKE_INDEX += 1;
        if(STROKE_INDEX == (STROKE_COLORS_ARRAY.length - 1)){
          this.pos = false;
        }
      } else {
        STROKE_INDEX -= 1;
        if(STROKE_INDEX == 0){
          this.pos = true;
        }
      }
    }
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