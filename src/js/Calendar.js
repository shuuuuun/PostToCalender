(function(win, doc, ns){
  
  var CLIENT_ID = '890138991807-okp2geobkejj9lngj22qcond9348pph8.apps.googleusercontent.com';
  var SCOPES = ["https://www.googleapis.com/auth/calendar"];
  var CALENDAR_ID = "h3k3hjao5l2vnpqivbu5lvcs44@group.calendar.google.com";//'primary';
  var API_KEY = "AIzaSyBultKZZsIiFj4QrUuavwsEH6yTCQEXACQ";
  
  ns.Calendar = function(){
  };
  
  ns.Calendar.prototype.checkAuth = function() {
    
    gapi.client.setApiKey(API_KEY); // 必要？
    
    gapi.auth.authorize(
      {
        'client_id': CLIENT_ID,
        'scope': SCOPES,
        'immediate': true
      },
      handleAuthResult
    );
  };

  ns.Calendar.prototype.handleAuthClick = function(event) {
    gapi.auth.authorize(
      {
        'client_id': CLIENT_ID,
        'scope': SCOPES,
        'immediate': false
      },
      handleAuthResult
    );
    return false;
  };
  
  function handleAuthResult(authResult) {
    var $authBtn = $(".js-authBtn");
    if (authResult && !authResult.error) {
      $authBtn.fadeOut();
      
      // loadCalendarApi
      gapi.client.load('calendar', 'v3', ns.Calendar.printCalendarList);
    } else {
      $authBtn.fadeIn();
    }
  };
  
  
  
  ns.Calendar.printCalendarList = function() {
    var that = ns.Calendar;
    
    var request = gapi.client.calendar.calendarList.list();
    request.execute(function(resp){
      for (var i in resp.items){
        that.printMsg('id:' + resp.items[i].id + ' summary:' + resp.items[i].summary);
      }
    });
  };
  
  
  ns.Calendar.printMsg = function(message) {
    var $msg = $(".message");
    $msg.append(message+"<br>");
  };
  
  
})(this, document, App);
