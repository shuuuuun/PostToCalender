(function(win, doc, ns){
  
  var CLIENT_ID = '890138991807-okp2geobkejj9lngj22qcond9348pph8.apps.googleusercontent.com';
  var SCOPES = ["https://www.googleapis.com/auth/calendar"];
  var CALENDAR_ID = "h3k3hjao5l2vnpqivbu5lvcs44@group.calendar.google.com";//'primary';
  var API_KEY = "AIzaSyBultKZZsIiFj4QrUuavwsEH6yTCQEXACQ";
  
  ns.Calender = function(){
  };
  
  /**
   * Check if current user has authorized this application.
   */
  ns.Calender.prototype.checkAuth = function() {
    console.log("checkAuth");
    // console.log(this); // => Object ns.Calender
    
    gapi.client.setApiKey(API_KEY);
    
    gapi.auth.authorize(
      {
        'client_id': CLIENT_ID,
        'scope': SCOPES,
        'immediate': true
      },
      this.handleAuthResult
    );
  };

  /**
   * Handle response from authorization server.
   *
   * @param {Object} authResult Authorization result.
   */
  ns.Calender.prototype.handleAuthResult = function(authResult) {
    console.log("handleAuthResult");
    // console.log(authResult, authRsesult.error);
    var authorizeDiv = document.getElementById('authorize-div');
    if (authResult && !authResult.error) {
      // Hide auth UI, then load client library.
      authorizeDiv.style.display = 'none';
      
      // console.log(this); // => window !!
      // console.log(this.loadCalendarApi); // => undefined
      // this.loadCalendarApi();
      // console.log(ns.Calender.loadCalendarApi); // => おし
      ns.Calender.loadCalendarApi();
    } else {
      // Show auth UI, allowing the user to initiate authorization by
      // clicking authorize button.
      authorizeDiv.style.display = 'initial';
    }
  };

  /**
   * Initiate auth flow in response to user clicking authorize button.
   *
   * @param {Event} event Button click event.
   */
  ns.Calender.prototype.handleAuthClick = function(event) {
    console.log("handleAuthClick");
    gapi.auth.authorize(
      {
        'client_id': CLIENT_ID,
        'scope': SCOPES,
        'immediate': false
      },
      this.handleAuthResult
    );
    return false;
  };

  /**
   * Load Google Calendar client library. List upcoming events
   * once client library is loaded.
   */
  // ns.Calender.prototype.loadCalendarApi = function() {
  ns.Calender.loadCalendarApi = function() {
    console.log("loadCalendarApi");
    // console.log(this); // => function ns.Calender
    // console.log(this.listUpcomingEvents); // => undefined ??
    // console.log(this.prototype.listUpcomingEvents); // => function
    gapi.client.load('calendar', 'v3', this.listUpcomingEvents);
    // gapi.client.load('calendar', 'v3', this.prototype.listUpcomingEvents);
  };

  /**
   * Print the summary and start datetime/date of the next ten events in
   * the authorized user's calendar. If no events are found an
   * appropriate message is printed.
   */
  // ns.Calender.prototype.listUpcomingEvents = function() {
  ns.Calender.listUpcomingEvents = function() {
    console.log("calenderlist");
    var restRequest = gapi.client.request({
      'path': '/calendar/v3/users/me/calendarList'
    });
    restRequest.execute(function(calendarList) {
      console.dir(calendarList);
    });
    
    return;
    
    console.log("listUpcomingEvents");
    // var that = this;
    // console.log(this); // => window
    var that = ns.Calender;
    
    var request = gapi.client.calendar.events.list({
      'calendarId': CALENDAR_ID,
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime'
    });

    request.execute(function(resp) {
      var events = resp.items;
      if (resp.error) {
        // console.log(resp.error);
        that.appendPre("Error Message: "+resp.error.message);
        return;
      }
      
      that.appendPre('Upcoming events:');

      if (events.length > 0) {
        for (i = 0; i < events.length; i++) {
          var event = events[i];
          var when = event.start.dateTime;
          if (!when) {
            when = event.start.date;
          }
          that.appendPre(event.summary + ' (' + when + ')');
        }
      } else {
        that.appendPre('No upcoming events found.');
      }

    });
  };

  /**
   * Append a pre element to the body containing the given message
   * as its text node.
   *
   * @param {string} message Text to be placed in pre element.
   */
  // ns.Calender.prototype.appendPre = function(message) {
  ns.Calender.appendPre = function(message) {
    // console.log("appendPre");
    var pre = document.getElementById('output');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
  };
  
  
})(this, document, App);
