var WIDTH_OF_MODAL = 250; //
var HALF_WIDTH_OF_MODAL = WIDTH_OF_MODAL/2;

function Record(height, width){
  this.height = height;
  this.width = width;
};

Record.prototype = {
  popUpModal: function(score){
    var div = document.createElement("div");
    div.className += "modal";
    div.style.right = ((this.width / 2) - HALF_WIDTH_OF_MODAL) + "px";
    div.style.top = (this.height / 2) + "px";
    div.innerHTML = "<br>" + "Your Score : " + score + "<br><br>";
    
    var input = document.createElement("input");
    input.name = "name-field";
    input.type = "text";
    input.className += "modal-input";

    var label = document.createElement("label");
    label.for = "name-field";
    label.innerHTML = "Enter Name" + "<br>";
    
    var optionsDiv = document.createElement("div");
    var submitDiv = document.createElement("div");
    var replayDiv = document.createElement("div");
    
    optionsDiv.className += "modal-options";
    submitDiv.className += "modal-submit";
    replayDiv.className += "modal-replay";
    
    submitDiv.innerHTML = "Submit";
    replayDiv.innerHTML = "Replay";
    
    //add elements to DOM
    var divInserted = document.body.appendChild(div);
    divInserted.appendChild(label);
    divInserted.appendChild(input);
    var optionsInserted = divInserted.appendChild(optionsDiv);
    optionsInserted.appendChild(submitDiv);
    optionsInserted.appendChild(replayDiv);
  },
};