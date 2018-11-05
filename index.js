var request = require('request');

let app_id = '84b66fad';
let app_key = 'd5c92ab3e708aee956adf533088ad795';

request('http://www.google.com', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});
