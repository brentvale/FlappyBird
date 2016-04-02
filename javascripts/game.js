var TICK_INTERVAL = 60;
var START_X = 50;
var START_Y = 0;
var WINDOW_HEIGHT = 0;
var WINDOW_WIDTH = 0;

function Game(context, height, width) {
  this.ctx = context;
  START_Y = height/3;
  this.bird = new Bird(START_X, START_Y, context);
  this.level = new Level(this.ctx, height, width, this.bird);
  this.gameRecord = new Record(height, width);
  this.addEventListeners();
  this.loop = 0;
  this.gameIsOver = false;
  WINDOW_HEIGHT = height;
  WINDOW_WIDTH = width;
};
Game.prototype = {
  addEventListeners: function(){
    var eventListenerToAdd = (mobileAndTabletcheck()) ? "touchstart" : "mousedown";
    this.ctx.canvas.addEventListener(eventListenerToAdd, this.bird.flap.bind(this.bird));
  },
  tick: function() {
    this.loop += 1;
    if(!this.gameIsOver){
      this.level.clearScreen();
      this.level.backgroundAndPipesTick();
      this.bird.tick(this.ctx);
      this.ctx.font = 'bold 50pt Arial'; 
      this.ctx.fillStyle = "white"; 
      this.ctx.fillText(this.level.score,700,100);
    }
    
    if(this.level.collidesWith(this.bird.getBounds())){
      this.gameIsOver = true;
      this.ctx.font = 'bold 50pt Arial';
      this.ctx.fillStyle = "white";
      this.ctx.fillText("Game Over", parseInt(this.ctx.canvas.style.width.slice(0,-2))/4,200);
      clearInterval(this.level.mainInterval);
      clearInterval(this.playInterval);
      var that = this;
      
      this.gameRecord.score = this.level.score;
      this.gameRecord.popUpModal();
      
      // setTimeout(function(){
//         var c = that.ctx.canvas.getContext('2d');
//         var newGame = new Game(c, WINDOW_HEIGHT, WINDOW_WIDTH);
//         newGame.prepare();
//
//         window.addEventListener("mousedown", function init(event) {
//           window.removeEventListener("mousedown", init, false);
//           gamePlay();
//         }, false);
//
//         function gamePlay() {
//           newGame.play();
//         }
//       }, 3000);
    }
  },
  prepare: function(){
    this.level.clearScreen();
    this.level.createBackgroundParticles();
  },
  play: function(){
    this.level.clearStartInterval();
    this.playInterval = setInterval(this.tick.bind(this), 10);
  },
  restart: function(){
    this.bird = new Bird(START_X, START_Y, this.ctx);
    this.level = new Level(this.ctx);
    this.addEventListeners();
    this.gameIsOver = false;
  }
}