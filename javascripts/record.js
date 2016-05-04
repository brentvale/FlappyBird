var WIDTH_OF_MODAL = 250; //
var HALF_WIDTH_OF_MODAL = WIDTH_OF_MODAL/2;

function Record(height, width){
  this.height = height;
  this.width = width;
  this.score;
};

var brentsFunction = function(){
  alert("hi brent");
};

Record.prototype = {
  popUpModal: function(){
    var div = document.createElement("div");
    div.className += "modal";
    div.style.right = ((this.width / 2) - HALF_WIDTH_OF_MODAL) + "px";
    div.style.top = (this.height / 2) + "px";
    div.innerHTML = "<br>" + "Your Score : " + this.score + "<br><br>";
    
    var input = document.createElement("input");
    input.name = "name-field";
    input.type = "text";
    input.className += "modal-input";
    input.id = "gamerName";

    var label = document.createElement("label");
    label.for = "name-field";
    label.innerHTML = "Enter Name" + "<br>";
    
    var optionsDiv = document.createElement("div");
    var submitDiv = document.createElement("div");
    var replayDiv = document.createElement("div");
    
    optionsDiv.className += "modal-options";
    submitDiv.className += "modal-submit";
    replayDiv.className += "modal-replay";
    submitDiv.id = "submit";
    replayDiv.id = "replay";
    
    submitDiv.innerHTML = "Submit";
    replayDiv.innerHTML = "Replay";
    
    //add elements to DOM
    var divInserted = document.body.appendChild(div);
    divInserted.appendChild(label);
    divInserted.appendChild(input);
    var optionsInserted = divInserted.appendChild(optionsDiv);
    optionsInserted.appendChild(submitDiv);
    optionsInserted.appendChild(replayDiv);
    
    this.addEventListenersToModal();
  },
  addEventListenersToModal: function(){
    var submitButton = document.getElementById('submit');
    var replayButton = document.getElementById('replay');
    submitButton.addEventListener("click", this.submitScore.bind(this));
    // replayButton.addEventListener("click", );
  },
  submitScore: function(){
    var gamerName = document.getElementById("gamerName").value;
    
    $.ajax({
      url: "http://localhost:3000/api/scores.json",
      type: "GET",
      dataType: "jsonp",
      data: {
        callback: function(){alert("called - back")}
      },
      success:function(resp){
        debugger
      },
      error: function(resp){
        debugger
      }
    })
    
    // var gamerName = document.getElementById("gamerName").value;
//     var method = "POST";
//     var url = "http://localhost:3000/api/scores";
//     var data = '"score": {"player_name": "' + gamerName + '", "points": "' + this.score + '"}';
//     var callback = {Function};
//     var errback = {Function};
//
//     var req;
//
//         if(XMLHttpRequest) {
//             req = new XMLHttpRequest();
//
//             if('withCredentials' in req) {
//                 req.open(method, url, true);
//                 req.onerror = errback;
//                 req.onreadystatechange = function() {
//                     if (req.readyState === 4) {
//                         if (req.status >= 200 && req.status < 400) {
//                             callback(req.responseText);
//                         } else {
//                             errback(new Error('Response returned with non-OK status'));
//                         }
//                     }
//                 };
//                 req.send(data);
//             }
//         } else if(XDomainRequest) {
//             req = new XDomainRequest();
//             req.open(method, url);
//             req.onerror = errback;
//             req.onload = function() {
//                 callback(req.responseText);
//             };
//             req.send(data);
//         } else {
//             errback(new Error('CORS not supported'));
//         }
  },
};