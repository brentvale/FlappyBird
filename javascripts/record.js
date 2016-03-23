function Record(height, width){
  this.height = height;
  this.width = width;
};

Record.prototype = {
  popUpModal: function(score){
    var div = document.createElement("div");
    div.className += "modal";
    div.style.right = (this.width / 2) + "px";
    div.style.top = (this.height / 2) + "px";
    div.innerHTML = score;
    
    var input = document.createElement("input");

    var divInserted = document.body.appendChild(div);
    divInserted.appendChild(input);
  },
};