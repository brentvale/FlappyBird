var PIPE_MOVEMENT = 2;
var PIPE_COLOR = "green";
var BACKGROUND_COLOR = "#87CEFF";
var HOLE_HEIGHT = 180;
var PIPE_WIDTH = 75;
var CANVAS_BASE = 0;
var CANVAS_HEIGHT = 480;
var CANVAS_WIDTH = 900;
var BUBBLE_SIZES = ["small", "med", "large", "xl"];
var BUBBLE_STACK_DENSITY = 80;
var BUBBLE_IMAGE_SIZE = 64; //128 x 128 png is four quadrants of height and width == 64
var TOTAL_PIPES = 3;
var STARTING_XS = [600,900,1200];
var STARTING_GAPS = [100,150,190];

function Level(context) {
  this.pipes = [];
  this.createPipes();
  this.ctx = context;
  this.score = 0;
  this.particles = [];
  this.bubbles = [];
  this.loadResource();
  this.loopCount = 0;
  this.createBubbles();
}

Level.prototype = {
  createPipes: function(){
    for(var i = 0; i < TOTAL_PIPES; i++){
      this.pipes.push(new Pipe(STARTING_XS[i], STARTING_GAPS[i]))
    }
  },
  drawBackground: function(context) {
    // context.fillStyle = BACKGROUND_COLOR;
    context.beginPath();
    context.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // context.fill();
  },
  drawPipes: function(context){
    for(var i = 0; i < 3; i++){
      context.fillStyle = PIPE_COLOR;
      context.beginPath();
      var rects = this.recCoords(i);
      
      context.rect(rects[0], rects[1], rects[2], rects[3]);
      context.rect(rects[4], rects[5], rects[6], rects[7]);
    }
  },
  
  handleBackgroundParticles: function(){
    this.loopCount += 1;
    this.createBackgroundParticles();
    this.updateBackgroundParticles();
    this.killBackgroundParticles();
    this.drawBackgroundParticles();
  
  },
  loadResource: function(){
    this.bubbleImage = new Image();
    this.bubbleImage.src = "images/Bubbles_for_flappy_dragon.png"
  },
  
  recCoords: function(idx) {
    var pipe = this.pipes[idx];
    var x1 = pipe.x;
    var y1 = CANVAS_BASE;
    var x2 = PIPE_WIDTH;
    var y2 = pipe.gap;
    
    var x3 = pipe.x;
    var y3 = pipe.gap + HOLE_HEIGHT;
    var x4 = PIPE_WIDTH;
    var y4 = CANVAS_HEIGHT;
    
    return [x1, y1, x2, y2, x3, y3, x4, y4];
  },
  
  movePipes: function(){
    for(var i = 0; i < this.pipes.length; i++){
      var localPipe = this.pipes[i];
      localPipe.x = localPipe.x - PIPE_MOVEMENT;
      if(localPipe.x < 0){
        localPipe.x = CANVAS_WIDTH;
        localPipe.gap = Math.floor(Math.random() * 200);
        this.score += 1;
        var bubblesArrayThisPipe = localPipe.bubbles;
        for(var j = 0; j < bubblesArrayThisPipe.length; j++){
          bubblesArrayThisPipe[j].x = bubblesArrayThisPipe[j].x + CANVAS_WIDTH;
          if(bubblesArrayThisPipe[j].topOfCol && (bubblesArrayThisPipe[j].y > localPipe.gap)){
            bubblesArrayThisPipe[j].y = Math.floor(Math.random() * (localPipe.gap));
          } else if(!bubblesArrayThisPipe[j].topOfCol && (bubblesArrayThisPipe[j].y < (localPipe.gap + HOLE_HEIGHT))){
            bubblesArrayThisPipe[j].y = Math.floor(Math.random() * (CANVAS_HEIGHT - (localPipe.gap + HOLE_HEIGHT)) + (localPipe.gap + HOLE_HEIGHT));
          }
        }
      }
    }
  },
  
  tick: function(context){
    this.drawBackground(context);
    this.movePipes();
    this.drawPipes(context);
    this.updateBubbles();
    this.drawBubbles();
  },
  
  pipeScore: function(){
    return this.score;
  },
  
  collidesWith: function(birdBounds){
    var x = birdBounds.topLeft[0];
    var y = birdBounds.topLeft[1];
    var a = birdBounds.bottomRight[0];
    var b = birdBounds.bottomRight[1];
    for(var i = 0; i < 3; i++){
      var rects = this.recCoords(i);
      var x1 = rects[0];
      var y1 = rects[1];
      var a1 = rects[2];
      var b1 = rects[3];
      
      var x2 = rects[4];
      var y2 = rects[5];
      var a2 = rects[6];
      var b2 = rects[7];
      if(a > x1 && a1 > x && b > y1 && b1 > y){
        return true;
      }
      if(a > x2 && a2 > x && b > y2 && b2 > y){
        return true;
      }
      if(y < 0 || b > CANVAS_HEIGHT){
        return true
      }
    } //end of for loop
    return false;
  }, //end of collidesWith function
  
  //Bubbles and particles logic
  createBackgroundParticles: function() { 
      //check on every 10th tick check 
      if(this.loopCount % 5 == 0) { 
          //add particle if fewer than 100 
          if(this.particles.length < 100) { 
              this.particles.push({ 
                      x: CANVAS_WIDTH, //all particles created on right side of canvas
                      y: Math.random()*canvas.height, 
                      speed: -(2+Math.random()*3), //between 2 and 5 
                      radius: 1+Math.random()*5, //between 5 and 10 
                      color: "white", 
              }); 
          } 
      } 
  },
  //creates 1 stack, top and bottom for each pipe
  createBubbles: function(){ 
    for(var j = 0; j < this.pipes.length; j ++){
      
      for(var i = 0; i < BUBBLE_STACK_DENSITY; i++){
        //xcord should be a random number between the pipe's x pos and the width of pipe
        var xcoord = Math.floor(Math.random() * PIPE_WIDTH + this.pipes[j].x);
        
        //y cords should be between -32 (1/2 width of image off the top side of the screen) and gap or between gap + Hole_heigh and canvas.height
        var ycoordPosOne = Math.floor(Math.random() * (this.pipes[j].gap + 32) - 32);
        var ycoordPosTwo = Math.floor(Math.random() * (CANVAS_HEIGHT - (this.pipes[j].gap + HOLE_HEIGHT)) + 
          (this.pipes[j].gap + HOLE_HEIGHT));
        var flipCoin = Math.floor(Math.random()*2);
        var ycoord;
        var topOfCol; //is it the top of pipe or bottom?
        if(flipCoin === 0){
          ycoord = ycoordPosOne;
          topOfCol = true;
        } else {
          ycoord = ycoordPosTwo;
          topOfCol = false
        }
        this.pipes[j].bubbles.push({
          x: xcoord, //xcoord of bounding box
          y: ycoord, //ycoord of bounding box
          speed: 0,
          pipe: this.pipes[j],
          size: BUBBLE_SIZES[Math.floor(Math.random()*4)],
          topOfCol: topOfCol
        })
      }
    }
  },
  
  updateBackgroundParticles: function() { 
    for(var i in this.particles) { 
        var part = this.particles[i]; 
        part.x += part.speed; 
    } 
  },
  updateBubbles: function(){
    for(var j in this.pipes){
      var pipe = this.pipes[j];
      for(var i in pipe.bubbles){
        var bubble = pipe.bubbles[i];
        bubble.x -= PIPE_MOVEMENT;
      }
    }
  },
  
  killBackgroundParticles: function (){
    for(var i in this.particles) { 
        var part = this.particles[i]; 
        if(part.x < 0) { 
            part.x = CANVAS_WIDTH; 
        } 
    } 
  },
  
  drawBackgroundParticles: function() { 
      
      // this.ctx.fillStyle = "black";
      this.ctx.fillRect(0,0,canvas.width,canvas.height); 
      for(var i in this.particles) { 
          var part = this.particles[i]; 
          this.ctx.beginPath(); 
          this.ctx.arc(part.x,part.y, part.radius, 0, Math.PI*2); 
          this.ctx.closePath(); 
          this.ctx.fillStyle = part.color; 
          this.ctx.fill(); 
      } 
  }, 
  
  drawBubbles: function(){
    for(var j in this.pipes){
      var pipe = this.pipes[j];
      for(var i in pipe.bubbles){
        var bubble = pipe.bubbles[i];
        this.ctx.drawImage(
        this.bubbleImage, 
        0,0,BUBBLE_IMAGE_SIZE,BUBBLE_IMAGE_SIZE,
        bubble.x, bubble.y,32,32)
      }
    }
  },
}