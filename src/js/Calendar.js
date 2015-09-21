(function(win, doc, ns){
  
  var CLIENT_ID = "890138991807-okp2geobkejj9lngj22qcond9348pph8.apps.googleusercontent.com";
  var SCOPES = ["https://www.googleapis.com/auth/calendar"];
  var CALENDAR_ID = "primary";
  // var CALENDAR_ID = "h3k3hjao5l2vnpqivbu5lvcs44@group.calendar.google.com";
  var API_KEY = "AIzaSyBultKZZsIiFj4QrUuavwsEH6yTCQEXACQ";
  
  ns.Calendar = function(){
    
    this.Evt = $({});
    
  };
  
  ns.Calendar.prototype.checkAuth = function() {
    
    gapi.client.setApiKey(API_KEY); // 必要？
    
    gapi.auth.authorize(
      {
        "client_id": CLIENT_ID,
        "scope": SCOPES,
        "immediate": true
      },
      handleAuthResult
    );
  };

  ns.Calendar.prototype.handleAuthClick = function(event) {
    gapi.auth.authorize(
      {
        "client_id": CLIENT_ID,
        "scope": SCOPES,
        "immediate": false
      },
      handleAuthResult
    );
    return false;
  };
  
  function handleAuthResult(authResult) {
    var $authBtn = $(".authBtn");
    if (authResult && !authResult.error) {
      $authBtn.hide();
      
      // loadCalendarApi
      gapi.client.load("calendar", "v3", ns.Calendar.printCalendarList);
    } else {
      $authBtn.show();
    }
  };
  
  
  
  ns.Calendar.prototype.postAttendEvent = function() {
    var that = this;
    
    var datetime = (new Date()).toISOString();
    var param = {
      "calendarId": CALENDAR_ID,
      "summary": "出勤",
      // "description": ",
      "start": {
        "dateTime": datetime,
      },
      "end": {
        "dateTime": datetime,
      },
    };
    
    that.postEvent(param);
    
    // that.Evt.on("posteventdone",function(){
    //   console.log("attend",that.lastResponse);
    // });
  };
  
  ns.Calendar.prototype.postLeaveEvent = function() {
    var that = this;
    
    var datetime = (new Date()).toISOString();
    var param = that.lastResponse;
    param.calendarId = CALENDAR_ID;
    param.eventId = that.currentEventID;
    param.end.dateTime = datetime;
    
    that.updateEvent(param);
    
    // that.Evt.on("updateeventdone",function(){
    //   console.log("leave",that.lastResponse);
    // });
  };
  
  ns.Calendar.prototype.postEvent = function(param) {
    var that = this;
    
    var request = gapi.client.calendar.events.insert(param);
    request.execute(function(response) {
      // console.log(response);
      that.lastResponse = response;
      that.currentEventID = response.id;
      // that.currentEventStart = response.start;
      that.Evt.trigger("posteventdone");
    });
  };
  
  ns.Calendar.prototype.updateEvent = function(param) {
    var that = this;
    
    var request = gapi.client.calendar.events.update(param);
    request.execute(function(response) {
      // console.log(response);
      that.lastResponse = response;
      that.currentEventID = response.id;
      that.Evt.trigger("updateeventdone");
    });
  };
  
  ns.Calendar.getCalendarList = function() {
    var that = ns.Calendar;
    
    var request = gapi.client.calendar.calendarList.list();
    request.execute(function(response){
      var events = response.items;
      for (var i in events){
        // that.printMsg("id:" + events[i].id + " summary:" + events[i].summary);
        return "id:" + events[i].id + " summary:" + events[i].summary;
      }
    });
  };
  
  
  ns.Calendar.printMsg = function(message) {
    var $msg = $(".message");
    $msg.append(message+"<br>");
  };
  
  
})(this, document, App);
