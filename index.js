var request = require('request');
var readline = require('readline-sync');

let appId = '84b66fad';
let appKey = 'd5c92ab3e708aee956adf533088ad795';
console.log("Please enter a bus stop number");
let busStop = readline.prompt();

request('https://api.tfl.gov.uk/StopPoint/' + busStop + '/' + 'arrivals?app_id=' + appId + '&app_key=' + appKey, function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  a = console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('body:', body); // Print the HTML for the Google homepage.
});
