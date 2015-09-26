(function(win, doc, ns){
  
  var $win = $(win);
  var util = new ns.Util();
  // util.bindOnResize();
  var calendar = new ns.Calendar();
  
  var isWorking = false;
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
      // printMsg("Thanks for your hard work!");
      printMsg("Good work!");
    });
    
    ns.Calendar.Evt.on("updateeventdone",function(){
      isWorking = false;
      showAttendBtn();
      clearMsg();
      // console.log("updateeventdone", calendar.lastResponse);
    });
    
    
    $setting.on("click",function(){
      setCalender();
    });
    
  });
  
  win.apionload = function(){
    // console.log("apionload");
    calendar.checkAuth();
    
  };
  
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
    $authBtn.fadeIn();
    $attendBtn.fadeOut();
    $leaveBtn.fadeOut();
    $icon.attr("href","./img/icon_auth.png");
  }
  function showAttendBtn(){
    $authBtn.fadeOut();
    $attendBtn.fadeIn();
    $leaveBtn.fadeOut();
    $icon.attr("href","./img/icon_attend.png");
  }
  function showLeaveBtn(){
    $authBtn.fadeOut();
    $attendBtn.fadeOut();
    $leaveBtn.fadeIn();
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
