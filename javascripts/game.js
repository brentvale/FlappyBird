var TICK_INTERVAL = 60;
var START_X = 50;
var START_Y = 50;

function Game(context, height, width) {
  this.ctx = context;
  this.bird = new Bird(START_X, START_Y);
  this.level = new Level(this.ctx, height, width);
  this.addEventListeners();
  this.loop = 0;
  this.gameIsOver = false;
};

Game.prototype = {
  addEventListeners: function(){
    this.ctx.canvas.addEventListener("mousedown", this.bird.flap.bind(this.bird));
  },
  tick: function() {
    if(!this.gameIsOver){
      //handling level tick in level so that game intro sequence 
      // this.level.tick(this.ctx);
      this.bird.tick(this.ctx);
    
      var score = this.level.pipeScore();
      this.ctx.font = 'bold 50pt Arial'; 
      this.ctx.fillStyle = "white"; 
      this.ctx.fillText(score,700,100);
    }
    
    if(this.level.collidesWith(this.bird.getBounds())){
      this.gameIsOver = true;
      this.ctx.font = 'bold 50pt Arial';
      this.ctx.fillStyle = "white";
      this.ctx.fillText("YOU LOSE", parseInt(this.ctx.canvas.style.width.slice(0,-2))/4,200);
      clearInterval(this.level.mainInterval);
      clearInterval(this.playInterval);
      
      //Game over, reload game
    }
  },
  prepare: function(){
    this.level.clearScreen();
    this.level.createBackgroundParticles();
  },
  play: function(){
    this.playInterval = setInterval(this.tick.bind(this), 1000 / TICK_INTERVAL);
  },
  restart: function(){
    this.bird = new Bird(START_X, START_Y);
    this.level = new Level(this.ctx);
    this.addEventListeners();
    this.gameIsOver = false;
  }
}