var TICK_INTERVAL = 5;
var START_X = 50;
var START_Y = 50;

function Game(context) {
  this.ctx = context;
  this.bird = new Bird(START_X, START_Y);
  this.level = new Level(this.ctx);
  this.addEventListeners();
};

Game.prototype = {
  addEventListeners: function(){
    this.ctx.canvas.addEventListener("mousedown", this.bird.flap.bind(this.bird));
  },
  tick: function() {
    this.level.tick(this.ctx);
    this.bird.tick(this.ctx);
    var score = this.level.pipeScore();
    this.ctx.font = 'bold 50pt Arial'; 
    this.ctx.fillStyle = "black"; 
    this.ctx.fillText(score,700,100);
    
    if(this.level.collidesWith(this.bird.getBounds())){
      console.log("you're losing");
      this.restart();
    }
  },
  play: function(){
    setInterval(this.tick.bind(this), 1000 / TICK_INTERVAL);
  },
  restart: function(){
    this.bird = new Bird(START_X, START_Y);
    this.level = new Level(this.ctx);
    this.addEventListeners();
  }
}