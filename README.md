# Basecamp 3 API & Google Sheets Integration

My company uses Basecamp3 to manage projects. In order to better manage client onboarding, I developed a suite of Google App Scripts tools to manage client data across several Google Sheets. Along the way, I found myself needing to perform simple URL GET, PUT, and POST operations through the BC3 API without getting my hands dirty with authentication, pagination, etc. with every call. The functions in this library allow you to do just that - perform any arbitrary fetch operations in accordance with the Basecamp3 API (documentation -> https://github.com/basecamp/bc3-api) while abstracting the nitty-gritty communications channel. 

This library streamlines the following operations between Google Sheets & BC3API:
  1) OAUTH2 authentication is inherent, just update the Client Secret and Client ID with your app's custom values
  2) Pagination through recurrsion is completely abstracted
  3) JSON response objected is parsed to a more practical object in the context of Googel App Scripts
  
To get started, simply follow these steps:
  1) Authorize your Google Sheet Document through the BC3 API. You will recieve a client ID and client secret to fufill OAuth2 operations
  2) Copy the JS content - paste in your Google App Script / Google Sheets Editor
  3) Substitute the top lines with your custom ID and secret
  4) Update all "User-Agent" headers to reflect the entity sending the requests
  
And just like that, you're good to go! This library provides three core functions:
  1) basecampPOST(DATA,URL)
  2) basecampPUT(DATA,URL)
  3) basecampGET(URL)
  
  The URLs and data will look different depending on your specific goal - refer to the BC3 API for more information.
  
*Basecamp requires users to occasionally re-authenticate their access. If your fetch operations get an authorazation error, run the "run" function. A new URL will be printed to the screen - open this page in a new browser to reauthenticate your connection to basecamp
