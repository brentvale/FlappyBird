function Pipe(x, gap) {
  this.x = x;
  this.gap = gap;
  this.bubbles = [];
};

Pipe.prototype = {
  x: function(){
    return this.x;
  },
  gap: function(){
    return this.gap;
  },
  addBubble: function(bubble){
    this.bubbles.push(bubble);
  }
}