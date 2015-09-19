(function(win, doc, ns){
  
  var $win = $(win);
  var util = new ns.Util();
  util.bindOnResize();
  var calendar = new ns.Calender();
  
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
  
  win.apionload = function(){
    // console.log("apionload");
    calendar.checkAuth();
    
    $(".js-authBtn").on("click",calendar.handleAuthClick);
    $("#authorize-button").on("click",calendar.handleAuthClick);
    
  };
  
  // for development
  win.dev = {
  };
  
})(this, document, App);
