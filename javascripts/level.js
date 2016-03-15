var PIPE_MOVEMENT = 2;
var PIPE_COLOR = "green";
var BACKGROUND_COLOR = "#87CEFF";
var HOLE_HEIGHT = 180;
var PIPE_WIDTH = 75;
var CANVAS_BASE = 0;
var CANVAS_HEIGHT = 0;
var CANVAS_WIDTH = 0;
var BUBBLE_SIZES = ["small", "med", "large", "xl"];
var BUBBLE_STACK_DENSITY = 80;
var BUBBLE_IMAGE_SIZE = 64; //128 x 128 png is four quadrants of height and width == 64
var TOTAL_PIPES = 3;
var STARTING_XS = [600,900,1200];
var STARTING_GAPS = [100,150,190];
var POSSIBLE_YVELS = [-6,-4,-2,2,4,6];

function Level(context, height, width) {
  this.pipes = [];
  this.createPipes();
  this.ctx = context;
  this.score = 0;
  this.particles = [];
  this.loopCount = 0;
  this.createBubbles();
  CANVAS_HEIGHT = height;
  CANVAS_WIDTH = width;
}

Level.prototype = {
  createPipes: function(){
    for(var i = 0; i < TOTAL_PIPES; i++){
      this.pipes.push(new Pipe(STARTING_XS[i], STARTING_GAPS[i]))
    }
  },
  clearScreen: function(){
    this.ctx.fillStyle = "black";
    this.ctx.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.ctx.fill();
  },
  createBackgroundParticles: function() { 
      //add particle if fewer than 100 
    for(var i = 0; i < 200; i++){
      this.particles.push({ 
              x: Math.random()*parseInt(canvas.style.width.slice(0,-2)),
              y: Math.random()*parseInt(canvas.style.height.slice(0,-2)),
              speed: -(2+Math.random()*3), //between 2 and 5 
              radius: 1+Math.random()*5, //between 5 and 10 
              color: "white", 
      }); 
    }
    this.backgroundParticlesTick(); 
  },
  
  backgroundParticlesTick: function(){
    this.mainInterval = setInterval(this.handleBackgroundParticles.bind(this), 50);
  },
  
  handleBackgroundParticles: function(){
    this.clearScreen();
    this.updateBackgroundParticles();
    this.killBackgroundParticles();
    this.drawBackgroundParticles();
  },
  updateBackgroundParticles: function() { 
    for(var i in this.particles) { 
        var part = this.particles[i]; 
        part.x += part.speed; 
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
  drawPipes: function(context){
    for(var i = 0; i < 3; i++){
      context.fillStyle = PIPE_COLOR;
      context.beginPath();
      var rects = this.recCoords(i);
    
      context.rect(rects[0], rects[1], rects[2], rects[3]);
      context.rect(rects[4], rects[5], rects[6], rects[7]);
    }
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
        for(var j = 0; j < BUBBLE_STACK_DENSITY; j++){
          bubblesArrayThisPipe[j].x = bubblesArrayThisPipe[j].x + CANVAS_WIDTH;
          if(bubblesArrayThisPipe[j].topOfCol && (bubblesArrayThisPipe[j].y > localPipe.gap)){
            bubblesArrayThisPipe[j].y = localPipe.gap;// Math.floor(Math.random() * (localPipe.gap));
            
            bubblesArrayThisPipe.push({
              x: CANVAS_WIDTH, //xcoord of bounding box
              y: (localPipe.gap + HOLE_HEIGHT), //ycoord of bounding box
              xVel: Math.floor(Math.random()*4 - 4),
              yVel: POSSIBLE_YVELS[Math.floor(Math.random()*POSSIBLE_YVELS.length)],
              size: BUBBLE_SIZES[Math.floor(Math.random()*POSSIBLE_YVELS.length)],
              topOfCol: true
            });
          } else if(!bubblesArrayThisPipe[j].topOfCol && (bubblesArrayThisPipe[j].y < (localPipe.gap + HOLE_HEIGHT))){
            bubblesArrayThisPipe[j].y = (localPipe.gap + HOLE_HEIGHT);// Math.floor(Math.random() * (CANVAS_HEIGHT - (localPipe.gap + HOLE_HEIGHT)) + (localPipe.gap + HOLE_HEIGHT));
            
            //create a new bubble that sits on edge of bounds
            bubblesArrayThisPipe.push({
              x: CANVAS_WIDTH, //xcoord of bounding box
              y: localPipe.gap,
              xVel: Math.floor(Math.random()*4 - 4),
              yVel: POSSIBLE_YVELS[Math.floor(Math.random()*POSSIBLE_YVELS.length)],
              size: BUBBLE_SIZES[Math.floor(Math.random()*POSSIBLE_YVELS.length)],
              topOfCol: false
            });
          }
        }
      }
    }
  },
  
  tick: function(context){
    
    this.movePipes();
    this.drawPipes(context);
    // this.updateBubbles();
//     this.drawBubbles();
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
        var xVel = Math.floor(Math.random()*4 - 4);
        var yVel = POSSIBLE_YVELS[Math.floor(Math.random()*4)];
        var bubbleToAdd = new Bubble({
          x: xcoord, //xcoord of bounding box
          y: ycoord, //ycoord of bounding box
          xVel: xVel, //velocity between -2 and +2
          yVel: yVel,
          sizeOf: BUBBLE_SIZES[Math.floor(Math.random()*4)],
          topOfCol: topOfCol
        })
        this.pipes[j].bubbles.push(bubbleToAdd)
      }
    }
  },
  
  
  // updateBubbles: function(){
 //    for(var j in this.pipes){
 //      var pipe = this.pipes[j];
 //      for(var i in pipe.bubbles){
 //        var bubble = pipe.bubbles[i];
 //        bubble.x += bubble.xVel;// (PIPE_MOVEMENT + bubble.xVel);
 //        bubble.y += bubble.yVel;
 //        // if bubble is in top, y cannot be less than 0, y cannot be greater than this.pipe.gap
 //        //x cannot be less this.pipe.x and cannot be greater than this.pipe.x + COLUMN_WIDTH
 //
 //        if(bubble.topOfCol){
 //          if(bubble.y <= -32){
 //            bubble.yVel = bubble.yVel * -1;
 //            bubble.y = 1;
 //          }
 //          if(bubble.y > pipe.gap){
 //            bubble.yVel = bubble.yVel * -1;
 //            bubble.y = pipe.gap - 1;
 //          }
 //          if(bubble.x < pipe.x){
 //            bubble.xVel = bubble.xVel * -1
 //            bubble.x = pipe.x + 1;
 //          }
 //          if(bubble.x >= (pipe.x + PIPE_WIDTH)){
 //            bubble.xVel = bubble.xVel * -1;
 //            bubble.x = (pipe.x + PIPE_WIDTH) - 1;
 //          }
 //        } else {
 //          if(bubble.y <= (pipe.gap + HOLE_HEIGHT)){
 //            bubble.yVel = bubble.yVel * -1;
 //            bubble.y = pipe.gap + HOLE_HEIGHT + 1;
 //          }
 //          if(bubble.y > CANVAS_HEIGHT){
 //            bubble.yVel = bubble.yVel * -1;
 //            bubble.y = CANVAS_HEIGHT - 1;
 //          }
 //          if(bubble.x < pipe.x){
 //            bubble.xVel = bubble.xVel * -1
 //            bubble.x = pipe.x + 1;
 //          }
 //          if(bubble.x >= (pipe.x + PIPE_WIDTH)){
 //            bubble.xVel = bubble.xVel * -1;
 //            bubble.x = (pipe.x + PIPE_WIDTH) - 1;
 //          }
 //        }
 //
 //        if(bubble.xVel === 0){
 //
 //          bubble.x -= 4;
 //        }
 //      }
 //    }
 //  },
  
  
  
   
  
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