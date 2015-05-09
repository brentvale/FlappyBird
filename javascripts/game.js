var TICK_INTERVAL = 60;
var START_X = 50;
var START_Y = 50;

function Game(context) {
  this.ctx = context;
  this.bird = new Bird(START_X, START_Y);
  this.level = new Level(this.ctx);
  this.addEventListeners();
  this.loop = 0;
  this.gameIsOver = false;
};

Game.prototype = {
  addEventListeners: function(){
    //made event listener click event for mobile compatibility
    this.ctx.canvas.addEventListener("click", this.bird.flap.bind(this.bird));
  },
  tick: function() {
    if(!this.gameIsOver){

      this.clearScreen();
      this.level.handleBackgroundParticles();
      
      this.level.tick(this.ctx);
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
      this.ctx.fillText("YOU LOSE",225,200);
      setTimeout(this.restart.bind(this), 2000)
    }
  },
  clearScreen: function(){
    this.ctx.fillStyle = "black";
    this.ctx.rect(0, 0, 900, 480);
    this.ctx.fill();
  },
  play: function(){
    setInterval(this.tick.bind(this), 1000 / TICK_INTERVAL);
  },
  restart: function(){
    this.bird = new Bird(START_X, START_Y);
    this.level = new Level(this.ctx);
    this.addEventListeners();
    this.gameIsOver = false;
  }
}