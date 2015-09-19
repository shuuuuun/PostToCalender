(function(win, doc, ns){
  
  var $win = $(win);
  var util = new ns.Util();
  util.bindOnResize();
  var calendar = new ns.Calendar();
  
  $(function(){
    
    if (ns.ua.isSP) {
      // sp
      $(".onlypc").remove();
    }
    else {
      // pc
      $(".onlysp").remove();
    }
    
  });
  
  function printMsg(message) {
    var $msg = $(".message");
    $msg.append(message+"<br>");
  }
  
  win.apionload = function(){
    // console.log("apionload");
    calendar.checkAuth();
    
    $(".authBtn").on("click", calendar.handleAuthClick);
    $("#authorize-button").on("click", calendar.handleAuthClick);
    
    
    $(".attendBtn").on("click", function(){
      calendar.postAttendEvent();
    });
    
  };
  
  // for development
  win.dev = {
  };
  
})(this, document, App);
