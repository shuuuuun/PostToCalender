(function(win, doc, ns){
  
  var $win = $(win);
  var util = new ns.Util();
  // util.bindOnResize();
  var calendar = new ns.Calendar();
  
  var isWorking = false;
  var $msg, $attendBtn, $leaveBtn;
  
  $(function(){
    $msg = $(".message");
    $attendBtn = $(".attendBtn");
    $leaveBtn = $(".leaveBtn");
    
    if (ns.ua.isSP) {
      // sp
      $(".onlypc").remove();
    }
    else {
      // pc
      $(".onlysp").remove();
    }
    
    
    $(".authBtn").on("click", calendar.handleAuthClick);
    
    $attendBtn.on("click", function(){
      if (isWorking) return;
      calendar.postAttendEvent();
      printMsg("Do your best!");
    });
    
    calendar.Evt.on("posteventdone",function(){
      isWorking = true;
      $attendBtn.fadeOut();
      $leaveBtn.fadeIn();
      printMsg("Now Working...");
      // console.log("posteventdone", calendar.lastResponse);
    });
    
    $leaveBtn.on("click", function(){
      if (!isWorking) return;
      calendar.postLeaveEvent();
      printMsg("Thanks for your hard work!");
    });
    
    calendar.Evt.on("updateeventdone",function(){
      isWorking = false;
      $leaveBtn.fadeOut();
      $attendBtn.fadeIn();
      clearMsg();
      // console.log("updateeventdone", calendar.lastResponse);
    });
    
  });
  
  win.apionload = function(){
    // console.log("apionload");
    calendar.checkAuth();
    
  };
  
  function printMsg(message) {
    clearMsg();
    $msg.append(message+"<br>");
  }
  function clearMsg() {
    $msg.empty();
  }
  
  // for development
  win.dev = {
  };
  
})(this, document, App);
