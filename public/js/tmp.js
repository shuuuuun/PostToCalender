function handleClientLoad(){gapi.client.setApiKey(apiKey),window.setTimeout(checkAuth,1)}function checkAuth(){gapi.auth.authorize({client_id:clientId,scope:scopes,immediate:!0},handleAuthResult)}function handleAuthResult(e){var t=document.getElementById("authorize-button");e&&!e.error?(t.style.visibility="hidden",makeApiCall()):(t.style.visibility="",t.onclick=handleAuthClick)}function handleAuthClick(e){return gapi.auth.authorize({client_id:clientId,scope:scopes,immediate:!1},handleAuthResult),!1}function makeApiCall(){return void gapi.client.load("calendar","v3",function(){var e=gapi.client.calendar.calendarList.list();e.execute(function(e){console.debug(e);for(var t in e.items)console.debug("id:"+e.items[t].id+" summary:"+e.items[t].summary)})})}var clientId="890138991807-okp2geobkejj9lngj22qcond9348pph8.apps.googleusercontent.com",apiKey="AIzaSyBultKZZsIiFj4QrUuavwsEH6yTCQEXACQ",scopes=["https://www.googleapis.com/auth/plus.me","https://www.googleapis.com/auth/calendar.readonly"];window.apionload=function(){handleClientLoad(),$(".js-authBtn").on("click",handleAuthClick),$("#authorize-button").on("click",handleAuthClick)};