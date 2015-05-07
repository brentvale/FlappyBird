var PIPE_MOVEMENT = 2;
var PIPE_COLOR = "green";
var BACKGROUND_COLOR = "#87CEFF";
var HOLE_HEIGHT = 180;
var PIPE_WIDTH = 75;
var CANVAS_BASE = 0;
var CANVAS_HEIGHT = 480;
var CANVAS_WIDTH = 900;

function Level(context) {
  this.pipes = [{x:600, gap:100}, {x:900, gap:150}, {x:1200, gap:190}];
  this.score = 0;
  this.particles = [];
}

Level.prototype = {
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
      
      context.fill();
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
    var that = this;
    this.pipes.forEach(function(pipe){
      pipe.x = pipe.x - PIPE_MOVEMENT;
      if(pipe.x < 0){
        pipe.x = CANVAS_WIDTH;
        pipe.gap = Math.floor(Math.random() * 200);
        that.score += 1;
      }
    })
  },
  tick: function(context){
    this.drawBackground(context);
    this.movePipes();
    this.drawPipes(context);
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
  
  createParticles: function(loopCount) { 
      //check on every 10th tick check 
      if(loopCount % 5 == 0) { 
          //add particle if fewer than 100 
          if(this.particles.length < 100) { 
              this.particles.push({ 
                      x: CANVAS_WIDTH, //between 0 and canvas width 
                      y: Math.random()*canvas.width, 
                      speed: -(2+Math.random()*3), //between 2 and 5 
                      radius: 1+Math.random()*5, //between 5 and 10 
                      color: "white", 
              }); 
          } 
      } 
  },
  updateParticles: function(loopCount) { 
    for(var i in this.particles) { 
        var part = this.particles[i]; 
        part.x += part.speed; 
    } 
  },
  killParticles: function (loopCount){
    for(var i in this.particles) { 
        var part = this.particles[i]; 
        if(part.x < 0) { 
            part.x = CANVAS_WIDTH; 
        } 
    } 
  },
  drawParticles: function(loopCount) { 
      var c = canvas.getContext('2d'); 
      // c.fillStyle = "black"; 
      c.fillRect(0,0,canvas.width,canvas.height); 
      for(var i in this.particles) { 
          var part = this.particles[i]; 
          c.beginPath(); 
          c.arc(part.x,part.y, part.radius, 0, Math.PI*2); 
          c.closePath(); 
          c.fillStyle = part.color; 
          c.fill(); 
      } 
  }, 
}