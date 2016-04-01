var PIPE_MOVEMENT = 2;
var PIPE_COLOR = "green";
var BACKGROUND_COLOR = "#87CEFF";
var HOLE_HEIGHT = 180;
var PIPE_WIDTH = 75;
var CANVAS_BASE = 0;
var BUBBLE_SIZES = ["small", "med", "large", "xl"];
var BUBBLE_STACK_DENSITY = 80;
var BUBBLE_IMAGE_SIZE = 64; //128 x 128 png is four quadrants of height and width == 64
var TOTAL_PIPES = 3;
var STARTING_XS = [600,900,1200];
var POSSIBLE_YVELS = [-6,-4,-2,2,4,6];
var TOTAL_BACKGROUND_PARTICLES = 100;

function Level(context, height, width, bird) {
  this.height = height;
  this.width = width;
  this.pipes = [];
  this.createPipes();
  this.ctx = context;
  this.score = 0;
  this.particles = [];
  this.loopCount = 0;
  this.bird = bird;
};

Level.prototype = {
  createPipes: function(){
    var startingGaps = [(this.height/2 - HOLE_HEIGHT/2), (this.height/2 + 50 - HOLE_HEIGHT/2)
      , (this.height/2 - 50 - HOLE_HEIGHT/2)];
    for(var i = 0; i < TOTAL_PIPES; i++){
      this.pipes.push(new Pipe(STARTING_XS[i], startingGaps[i]))
    }
  },
  clearScreen: function(){
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.width, this.height);
    this.ctx.fillStyle = "black";
    this.ctx.fill();
  },
  clearStartInterval: function(){
    clearInterval(this.startInterval);
  },
  createBackgroundParticles: function() { 
    for(var i = 0; i < TOTAL_BACKGROUND_PARTICLES; i++){
      this.particles.push({ 
              y: Math.random()*parseInt(this.height),
              x: Math.random()*parseInt(this.width),
              speed: -(2+Math.random()), //between 2 and 5 
              radius: 1+Math.random()*5, //between 5 and 10 
              color: "white", 
      }); 
    }
    this.backgroundParticlesTick(); 
  },
  backgroundAndPipesTick: function(){
    this.handlePipes();
    this.handleBackgroundParticles();
  },
  backgroundParticlesTick: function(){
    this.startInterval = setInterval(this.handleBackgroundParticlesIntro.bind(this), 15);
  },
  handleBackgroundParticlesIntro: function(){
    this.clearScreen();
    this.handleBackgroundParticles();
    this.bird.draw();
  },
  handleBackgroundParticles: function(){
    this.updateBackgroundParticles();
    this.drawBackgroundParticles();
  },
  updateBackgroundParticles: function() { 
    for(var i in this.particles) { 
        var part = this.particles[i]; 
        part.x += part.speed; 
        //if particle reaches screen edge, loop around to next screen edge
        if(part.x < 0) { 
            part.x = this.width; 
        } 
    } 
  },
  drawBackgroundParticles: function() { 
      for(var i in this.particles) { 
          var part = this.particles[i]; 
          this.ctx.beginPath(); 
          this.ctx.arc(part.x,part.y, part.radius, 0, Math.PI*2); 
          this.ctx.closePath(); 
          this.ctx.fillStyle = part.color; 
          this.ctx.fill(); 
      } 
  },
  drawPipes: function(){
    for(var i = 0; i < 3; i++){
      var pipe = this.pipes[i];
      this.ctx.beginPath();
      this.ctx.fillStyle = "green";
      this.ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.gap);
      this.ctx.fillRect(pipe.x, (pipe.gap + HOLE_HEIGHT), PIPE_WIDTH, this.height);
      this.ctx.fill();
    }
  },
  movePipes: function(){
    for(var i = 0; i < this.pipes.length; i++){
      var localPipe = this.pipes[i];
      localPipe.x = localPipe.x - PIPE_MOVEMENT;
      if(localPipe.x < 0){
        localPipe.x = this.width;
        //contain pipe gap to middle 60% of screen height
        //achieved by taking 80% of gap and moving it down 20% of the screen
        localPipe.gap = Math.floor(Math.random() * (this.height * .6) + (.1*this.height));
        this.score += 1;
      }
    }
  },
  handlePipes: function(){
    this.movePipes();
    this.drawPipes();
  },
  collidesWith: function(birdBounds){
    var x = birdBounds.topLeft[0];
    var y = birdBounds.topLeft[1];
    var a = birdBounds.bottomRight[0];
    var b = birdBounds.bottomRight[1];
    for(var i = 0; i < 3; i++){
      var pipe = this.pipes[i];
      
      var x1 = pipe.x;
      var y1 = 0;
      var a1 = PIPE_WIDTH;
      var b1 = pipe.gap;
      
      var x2 = pipe.x;
      var y2 = (pipe.gap + HOLE_HEIGHT);
      var a2 = PIPE_WIDTH;
      var b2 = this.height;
      if(a > x1 && a1 > x && b > y1 && b1 > y){
        return true;
      }
      if(a > x2 && a2 > x && b > y2 && b2 > y){
        return true;
      }
      if(y < 0 || b > this.height){
        return true
      }
    } //end of for loop
    return false;
  }, //end of collidesWith function
}