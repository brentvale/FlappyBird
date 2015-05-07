var TICK_INTERVAL = 60;
var START_X = 50;
var START_Y = 50;

function Game(context) {
  this.ctx = context;
  this.bird = new Bird(START_X, START_Y);
  this.level = new Level(this.ctx);
  this.addEventListeners();
  this.loop = 0;
};

Game.prototype = {
  addEventListeners: function(){
    this.ctx.canvas.addEventListener("mousedown", this.bird.flap.bind(this.bird));
  },
  tick: function() {
    this.loop += 1;

    this.clearScreen();
    this.level.createParticles(this.loop);
    this.level.updateParticles(this.loop);
    this.level.killParticles(this.loop);
    this.level.drawParticles(this.loop);
    
    this.level.tick(this.ctx);
    this.bird.tick(this.ctx);
    
    var score = this.level.pipeScore();
    this.ctx.font = 'bold 50pt Arial'; 
    this.ctx.fillStyle = "white"; 
    this.ctx.fillText(score,700,100);
    
    if(this.level.collidesWith(this.bird.getBounds())){
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
  }
}