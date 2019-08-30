var CLIENT_ID = 'YOUR_CLIENT_ID';
var CLIENT_SECRET = 'YOUR_CLIENT_SECRET';

/**
 * Authorizes and makes a request to the Basecamp 3 API.
 */

function basecampPOST(DATA,URL) {
  var service = getService();
  var myHeader = {
        'Authorization': 'Bearer ' + service.getAccessToken(),
        'User-Agent': "MY-ORGANIZATION, MY-EMAIL",
        'Content-Type': 'application/json'
  };
  if (service.hasAccess()) {
    var url = URL;
    var data = DATA;
    var response = UrlFetchApp.fetch(url, {
      method: "POST", // 'GET', 'PUT', 'DELETE', etc.
      headers: myHeader,
      payload: JSON.stringify(data)
    });
    var result = JSON.parse(response.getContentText());
  } 
  
  else {
    var authorizationUrl = service.getAuthorizationUrl();
    SpreadsheetApp.getUi().alert("You have been disconnected from Basecamp. Please Run the Authorization Program");
  }
  
  return result;
}

function basecampPUT(DATA,URL) {
  var service = getService();
  var myHeader = {
        'Authorization': 'Bearer ' + service.getAccessToken(),
        'User-Agent': "MY-ORGANIZATION, MY-EMAIL",
        'Content-Type': 'application/json'
  };
  if (service.hasAccess()) {
    var url = URL;
    var data = DATA;
    var response = UrlFetchApp.fetch(url, {
      method: "PUT", // 'GET', 'PUT', 'DELETE', etc.
      headers: myHeader,
      payload: JSON.stringify(data)
    });
    var result = JSON.parse(response.getContentText());
  } 
  
  else {
    var authorizationUrl = service.getAuthorizationUrl();
    SpreadsheetApp.getUi().alert("You have been disconnected from Basecamp. Please Run the Authorization Program");
  }
  
  return result;
}

function basecampGET(URL) {
  var service = getService();
  var myHeader = {
        'Authorization': 'Bearer ' + service.getAccessToken(),
        'User-Agent': "MY-ORGANIZATION, MY-EMAIL",
        'Content-Type': 'application/json'
  };
  if (service.hasAccess()) {
    var url = URL;
    var response = UrlFetchApp.fetch(url, {
      method: "GET", // 'GET', 'PUT', 'DELETE', etc.
      headers: myHeader
    });
    //console.log(response.getAllHeaders()); // this will give you headers from the get 
    var result = JSON.parse(response.getContentText());
  } 
  
  else {
    var authorizationUrl = service.getAuthorizationUrl();
    SpreadsheetApp.getUi().alert("You have been disconnected from Basecamp. Please Run the Authorization Program");
  }

    var finalData = pagination(response, result);
    return finalData;
}

/**
 * Reset the authorization state, so that it can be re-tested.
 */
function reset() {
  getService().reset();
}

/**
 * Configures the service.
 */
function getService() {
  return OAuth2.createService('Basecamp')
      // Set the endpoint URLs.
      .setAuthorizationBaseUrl(
          'https://launchpad.37signals.com/authorization/new?type=web_server')
      .setTokenUrl(
          'https://launchpad.37signals.com/authorization/token?type=web_server')

      // Set the client ID and secret.
      .setClientId(CLIENT_ID)
      .setClientSecret(CLIENT_SECRET)

      // Set the name of the callback function that should be invoked to
      // complete the OAuth flow.
      .setCallbackFunction('authCallback')

      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getUserProperties());
}

/**
 * Handles the OAuth callback.
 */
function authCallback(request) {
  var service = getService();
  var authorized = service.handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput('Success!');
  } else {
    return HtmlService.createHtmlOutput('Denied.');
  }
}

/**
 * Logs the redict URI to register.
 */
function logRedirectUri() {
  Logger.log(OAuth2.getRedirectUri());
}

function authorize() { //Authorization Program
  var service = getService();
  if (service.hasAccess()) {
    var url = 'https://launchpad.37signals.com/authorization.json';
    var response = UrlFetchApp.fetch(url, {
      headers: {
        Authorization: 'Bearer ' + service.getAccessToken()
      }
    });
    var result = JSON.parse(response.getContentText());
    Logger.log(JSON.stringify(result, null, 2));
  } else {
    var authorizationUrl = service.getAuthorizationUrl();
    SpreadsheetApp.getUi().alert(authorizationUrl);
  }
}

//Abstraction for JSON paginated responses
function pagination(response, result){
  if(response.getAllHeaders().Link == undefined){return result;}
  var nextURL = response.getAllHeaders().Link.split("<")[1].split(">")[0];
  var paginated = basecampGET(nextURL);
  for(i = 0; i < paginated.length; i++){
     result.push(paginated[i]);
  }
  return result;
}

function run() { //Authorization Program
  var service = getService();
  if (service.hasAccess()) {
    var url = 'https://launchpad.37signals.com/authorization.json';
    var response = UrlFetchApp.fetch(url, {
      headers: {
        Authorization: 'Bearer ' + service.getAccessToken()
      }
    });
    var result = JSON.parse(response.getContentText());
    Logger.log(JSON.stringify(result, null, 2));
  } else {
    var authorizationUrl = service.getAuthorizationUrl();
    SpreadsheetApp.getUi().alert('Open the following URL and re-run the script: ' + authorizationUrl);
  }
}