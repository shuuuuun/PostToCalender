(function(win, doc, ns){
  
  var $win = $(win);
  var util = new ns.Util();
  // util.bindOnResize();
  var calendar = new ns.Calendar();
  
  var isWorking = false;
  var $msg, $authBtn, $attendBtn, $leaveBtn;
  
  $(function(){
    $msg = $(".message");
    $authBtn = $(".authBtn");
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
    
    
    ns.Calendar.Evt.on("haveAuthed",function(){
      $authBtn.fadeOut();
      isWorking = calendar.checkCookies();
      if (isWorking) showLeaveBtn();
      else showAttendBtn();
    }).on("shouldAuth",function(){
      showAuthBtn();
    });
    
    $authBtn.on("click", calendar.handleAuthClick);
    
    $attendBtn.on("click", function(){
      if (isWorking) return;
      calendar.postAttendEvent();
      printMsg("Do your best!");
    });
    
    ns.Calendar.Evt.on("posteventdone",function(){
      isWorking = true;
      showLeaveBtn();
      // console.log("posteventdone", calendar.lastResponse);
    });
    
    $leaveBtn.on("click", function(){
      if (!isWorking) return;
      calendar.postLeaveEvent();
      printMsg("Thanks for your hard work!");
    });
    
    ns.Calendar.Evt.on("updateeventdone",function(){
      isWorking = false;
      showAttendBtn();
      clearMsg();
      // console.log("updateeventdone", calendar.lastResponse);
    });
    
  });
  
  win.apionload = function(){
    // console.log("apionload");
    calendar.checkAuth();
    
  };
  
  function showAuthBtn(){
    $authBtn.fadeIn();
    $attendBtn.fadeOut();
    $leaveBtn.fadeOut();
  }
  function showAttendBtn(){
    $authBtn.fadeOut();
    $attendBtn.fadeIn();
    $leaveBtn.fadeOut();
  }
  function showLeaveBtn(){
    $authBtn.fadeOut();
    $attendBtn.fadeOut();
    $leaveBtn.fadeIn();
    printMsg("Now Working!");
  }
  
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
