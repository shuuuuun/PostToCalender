(function(win, doc, ns){
  
  var CLIENT_ID = "890138991807-okp2geobkejj9lngj22qcond9348pph8.apps.googleusercontent.com";
  var SCOPES = ["https://www.googleapis.com/auth/calendar"];
  // var SCOPES = ["https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email"];
  // var CALENDAR_ID = "primary";
  // var CALENDAR_ID = "h3k3hjao5l2vnpqivbu5lvcs44@group.calendar.google.com";
  var API_KEY = "AIzaSyBultKZZsIiFj4QrUuavwsEH6yTCQEXACQ";
  var SUMMARY = "worktime";
  
  ns.Calendar = function(){
    
    // this.Evt = $({});
    this.CALENDAR_ID = "primary";
    
  };
  ns.Calendar.Evt = $({});
  
  ns.Calendar.prototype.checkAuth = function() {
    
    gapi.client.setApiKey(API_KEY); // 必要？
    
    gapi.auth.authorize(
      {
        client_id: CLIENT_ID,
        scope: SCOPES,
        immediate: true
      },
      handleAuthResult
    );
  };

  ns.Calendar.prototype.handleAuthClick = function(event) {
    gapi.auth.authorize(
      {
        client_id: CLIENT_ID,
        scope: SCOPES,
        immediate: false
      },
      handleAuthResult
    );
    return false;
  };
  
  function handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
      // loadCalendarApi
      gapi.client.load("calendar", "v3", function(){
        ns.Calendar.Evt.trigger("haveAuthed");
      });
    } else {
      ns.Calendar.Evt.trigger("shouldAuth");
    }
  };
  
  
  ns.Calendar.prototype.checkIsWorking = function(callback) {
    var that = this;
    
    that.checkCookies();
    that.checkWorkingEvent(function(){
      callback(!!that.currentEventID);
    });
    
    // if (!this.currentEventID) return false;
    
    // var param = {
    //   calendarId: this.CALENDAR_ID,
    //   eventId: this.currentEventID,
    // };
    // this.getEvent(param);
    
    // return true;
  };
  ns.Calendar.prototype.checkCookies = function() {
    // var eventid = Cookies.get("PTC-eventid");
    // this.currentEventID = (eventid) ? eventid : false;
    
    var calendarid = Cookies.get("PTC-calendarid");
    this.CALENDAR_ID = (calendarid) ? calendarid : "primary";
  };
  ns.Calendar.prototype.checkWorkingEvent = function(callback) {
    var param = {
      calendarId: this.CALENDAR_ID,
      sharedExtendedProperty: "isWorking=true",
    };
    this.getEventList(param, callback);
  };
  
  
  ns.Calendar.prototype.postAttendEvent = function() {
    var that = this;
    
    var datetime = (new Date()).toISOString();
    var param = {
      calendarId: that.CALENDAR_ID,
      summary: SUMMARY,
      // description: ",
      start: {
        dateTime: datetime,
      },
      end: {
        dateTime: datetime,
      },
      extendedProperties: {
        shared: {
          isWorking: true,
        },
      },
    };
    
    that.postEvent(param);
  };
  
  ns.Calendar.prototype.postLeaveEvent = function() {
    var that = this;
    
    var datetime = (new Date()).toISOString();
    var param = that.lastResponse;
    param.calendarId = that.CALENDAR_ID;
    param.eventId = that.currentEventID;
    param.end.dateTime = datetime;
    param.extendedProperties.shared.isWorking = false;
    
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
      ns.Calendar.Evt.trigger("geteventdone");
    });
  };
  
  ns.Calendar.prototype.getEventList = function(param, callback) {
    var that = this;
    
    var request = gapi.client.calendar.events.list(param);
    request.execute(function(response){
      var events = response.items;
      var last = events.length - 1;
      if (last < 0) return;
      that.lastResponse = events[last];
      that.currentEventID = events[last].id;
      callback();
      ns.Calendar.Evt.trigger("geteventlistdone");
    });
  };
  
  
  ns.Calendar.prototype.getCalendarList = function(callback) {
    var that = this;
    
    that.calendarList = [];
    var request = gapi.client.calendar.calendarList.list();
    request.execute(function(response){
      var events = response.items;
      for (var i in events){
        that.calendarList[i] = {
          id: events[i].id,
          summary: events[i].summary,
        };
      }
      callback();
    });
  };
  
  ns.Calendar.prototype.setCalendarId = function(calendarId) {
    this.CALENDAR_ID = calendarId;
    Cookies.set("PTC-calendarid", calendarId);
  };
  
  
})(this, document, App);
