(function(win, doc, ns){
  
  var CLIENT_ID = "890138991807-okp2geobkejj9lngj22qcond9348pph8.apps.googleusercontent.com";
  var SCOPES = ["https://www.googleapis.com/auth/calendar"];
  var CALENDAR_ID = "primary";
  // var CALENDAR_ID = "h3k3hjao5l2vnpqivbu5lvcs44@group.calendar.google.com";
  var API_KEY = "AIzaSyBultKZZsIiFj4QrUuavwsEH6yTCQEXACQ";
  
  ns.Calendar = function(){
    
    // this.Evt = $({});
    
  };
  ns.Calendar.Evt = $({});
  
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
    if (authResult && !authResult.error) {
      // ns.Calendar.Evt.trigger("haveAuthed");
      
      // loadCalendarApi
      gapi.client.load("calendar", "v3", function(){
        ns.Calendar.Evt.trigger("haveAuthed");
      });
    } else {
      ns.Calendar.Evt.trigger("shouldAuth");
    }
  };
  
  
  ns.Calendar.prototype.checkCookies = function() {
    var eventid = Cookies.get("PTC-eventid");
    if (!eventid) return false;
    
    this.currentEventID = eventid;
    var param = {
      "calendarId": CALENDAR_ID,
      "eventId": eventid,
    };
    this.getEvent(param);
    return true;
  };
  
  
  ns.Calendar.prototype.postAttendEvent = function() {
    var that = this;
    
    var datetime = (new Date()).toISOString();
    var param = {
      "calendarId": CALENDAR_ID,
      "summary": "working time",
      // "description": ",
      "start": {
        "dateTime": datetime,
      },
      "end": {
        "dateTime": datetime,
      },
    };
    
    that.postEvent(param);
  };
  
  ns.Calendar.prototype.postLeaveEvent = function() {
    var that = this;
    
    var datetime = (new Date()).toISOString();
    var param = that.lastResponse;
    param.calendarId = CALENDAR_ID;
    param.eventId = that.currentEventID;
    param.end.dateTime = datetime;
    
    that.updateEvent(param);
  };
  
  ns.Calendar.prototype.postEvent = function(param) {
    var that = this;
    
    var request = gapi.client.calendar.events.insert(param);
    request.execute(function(response) {
      // console.log(response);
      that.lastResponse = response;
      that.currentEventID = response.id;
      // that.currentEventStart = response.start;
      ns.Calendar.Evt.trigger("posteventdone");
      Cookies.set("PTC-eventid", that.currentEventID, { expires: 3 });
    });
  };
  
  ns.Calendar.prototype.updateEvent = function(param) {
    var that = this;
    
    var request = gapi.client.calendar.events.update(param);
    request.execute(function(response) {
      // console.log(response);
      that.lastResponse = response;
      that.currentEventID = response.id;
      ns.Calendar.Evt.trigger("updateeventdone");
      Cookies.remove("PTC-eventid");
    });
  };
  
  ns.Calendar.prototype.getEvent = function(param) {
    var that = this;
    
    var request = gapi.client.calendar.events.get(param);
    request.execute(function(response){
      that.lastResponse = response;
    });
  };
  
  
  ns.Calendar.getCalendarList = function() {
    var request = gapi.client.calendar.calendarList.list();
    request.execute(function(response){
      var events = response.items;
      for (var i in events){
        return "id:" + events[i].id + " summary:" + events[i].summary;
      }
    });
  };
  
  
})(this, document, App);
