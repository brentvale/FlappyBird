function Pipe(x, gap) {
  this.x = x;
  this.gap = gap;
  this.coords;
};

Pipe.prototype = {
  x: function(){
    return this.x;
  },
  gap: function(){
    return this.gap;
  },
};