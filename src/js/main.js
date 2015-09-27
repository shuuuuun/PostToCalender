(function(win, doc, ns){
  
  var $win = $(win);
  var util = new ns.Util();
  // util.bindOnResize();
  var calendar = new ns.Calendar();
  
  var isWorking = false,
      isBtnPressed = false;
  var $icon, $setting, $msg, $modal, $authBtn, $attendBtn, $leaveBtn;
  
  $(function(){
    $icon = $(".apple-touch-icon");
    $setting = $(".setting");
    $msg = $(".message");
    $modal = $(".modal");
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
    
    
    $setting.on("click",function(){
      setCalender();
    });
    
    $authBtn.on("click", function(evt){
      if (isBtnPressed) {
        printMsg("Please wait...");
        return;
      }
      isBtnPressed = true;
      clearMsg();
      calendar.handleAuthClick(evt);
    });
    
    $attendBtn.on("click", function(){
      if (isBtnPressed || isWorking) {
        printMsg("Please wait...");
        return;
      }
      isBtnPressed = true;
      calendar.postAttendEvent();
      printMsg("Do your best!");
    });
    
    $leaveBtn.on("click", function(){
      if (isBtnPressed || !isWorking) {
        printMsg("Please wait...");
        return;
      }
      isBtnPressed = true;
      calendar.postLeaveEvent();
      // printMsg("Thanks for your hard work!");
      printMsg("Good work!");
    });
    
  });
  
  
  win.apionload = function(){
    calendar.checkAuth();
  };
  
  
  ns.Calendar.Evt.on("haveAuthed",function(){
    // isWorking = calendar.checkIsWorking();
    // if (isWorking) showLeaveBtn();
    // else showAttendBtn();
    calendar.checkIsWorking(function(result){
      isWorking = result;
      if (isWorking) showLeaveBtn();
      else showAttendBtn();
    });
  }).on("shouldAuth",function(){
    showAuthBtn();
  });
  
  ns.Calendar.Evt.on("posteventdone",function(){
    isWorking = true;
    showLeaveBtn();
    // console.log("posteventdone", calendar.lastResponse);
  });
  
  ns.Calendar.Evt.on("updateeventdone",function(){
    isWorking = false;
    showAttendBtn();
    // clearMsg();
    // console.log("updateeventdone", calendar.lastResponse);
  });
  
  
  function setCalender(){
    setCalenderList2modal();
    $modal.show();
  }
  function setCalenderList2modal(){
    var $calendarSelecter = $(".modal_calendar-selecter");
    calendar.getCalendarList(function(){
      $(calendar.calendarList).each(function(i,val){
        var $li = $("<li>");
        $li.addClass("modal_calendar-selecter_item");
        $li.append("<span class='calendar_summary'>" + val.summary + "</span><br><span class='calendar_id'>" + val.id + "</span>");
        $calendarSelecter.append($li);
        
        $li.on("click",function(){
          calendar.setCalendarId(val.id);
          $modal.fadeOut();
        });
      });
    });
  }
  
  
  function showAuthBtn(){
    clearMsg();
    $authBtn.fadeIn(function(){ isBtnPressed = false; });
    $attendBtn.fadeOut();
    $leaveBtn.fadeOut();
    $icon.attr("href","./img/icon_auth.png");
  }
  function showAttendBtn(){
    clearMsg();
    $authBtn.fadeOut();
    $attendBtn.fadeIn(function(){ isBtnPressed = false; });
    $leaveBtn.fadeOut();
    $icon.attr("href","./img/icon_attend.png");
  }
  function showLeaveBtn(){
    clearMsg();
    $authBtn.fadeOut();
    $attendBtn.fadeOut();
    $leaveBtn.fadeIn(function(){ isBtnPressed = false; });
    printMsg("Now Working!");
    $icon.attr("href","./img/icon_leave.png");
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
