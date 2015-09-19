var clientId = '890138991807-okp2geobkejj9lngj22qcond9348pph8.apps.googleusercontent.com';
var apiKey = 'AIzaSyBultKZZsIiFj4QrUuavwsEH6yTCQEXACQ';

// とりあえず、怖いので、カレンダーを読むだけの設定
// https://www.googleapis.com/auth/plus.meは不要かも。。

var scopes = ['https://www.googleapis.com/auth/plus.me',
             'https://www.googleapis.com/auth/calendar.readonly'];

function handleClientLoad() {
  // 予めAPI Consoleで設定したAPIキーを設定
  gapi.client.setApiKey(apiKey);

  // すでに認証済みかの確認をする。
  window.setTimeout(checkAuth,1);
}

function checkAuth() {
  // immediateをtrueで指定することで、未認証の場合、ただちにエラーが返り、
  // handleAuthResultが呼び出される。
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
}

function handleAuthResult(authResult) {
  // console.log("handleAuthResult");
  // console.log(authResult, authResult.error);
  var authorizeButton = document.getElementById('authorize-button');
  if (authResult && !authResult.error) {
    authorizeButton.style.visibility = 'hidden';
    makeApiCall();
  } else {
    authorizeButton.style.visibility = '';
    authorizeButton.onclick = handleAuthClick;
  }
}

function handleAuthClick(event) {
  // ここで、ポップアップ画面を表示して、OAuth認証を行う。
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
  return false;
}

function makeApiCall() {
  
  // ライブラリをロードする
  gapi.client.load('calendar', 'v3', function(){
    // リクエストメソッド設定(パラメータなし)
    var request = gapi.client.calendar.calendarList.list();
    // リクエスト実行
    request.execute(function(resp){
      console.debug(resp);
      for (var i in resp.items){
        // カレンダーIDとカレンダー名を表示
        console.debug('id:' + resp.items[i].id + ' summary:' + resp.items[i].summary);
      }
    });
  });
  return;
  
  var restRequest = gapi.client.request({
      'path': '/calendar/v3/users/me/calendarList'
  });
  console.log("restRequest", restRequest);
  restRequest.execute(function(calendarList) {
    console.dir(calendarList);
  });
}

window.apionload = function(){
  // console.log("apionload");
  // checkAuth();
  handleClientLoad();
  
  $(".js-authBtn").on("click", handleAuthClick);
  $("#authorize-button").on("click", handleAuthClick);
  
};
