var request = require('request');
var readline = require('readline-sync');
var log4js = require('log4js');
var moment = require('moment');

//=============================================================
//===========================LOGGING===========================

log4js.configure({
    appenders: {
        file: { type: 'fileSync',
                filename: 'logs/debug.log'
        }
    },
    categories: {
        default: { appenders: ['file'],
                   level: 'debug'
        }
    }
});

const logger = log4js.getLogger();

function sortBusArrivals(arrivingBuses){

  function compare(a,b) {
    if (a.timeToLive < b.timeToLive)
      return -1;
    if (a.timeToLive > b.timeToLive)
      return 1;
    return 0;
  }

  arrivingBuses = arrivingBuses.sort(compare);

  return arrivingBuses
}


//=============================================================

let appId = '84b66fad';
let appKey = 'd5c92ab3e708aee956adf533088ad795';
console.log("Please enter a bus stop number");
// let busStop = readline.prompt();
let busStop = '490008660N'
logger.info("User input taken")

request('https://api.tfl.gov.uk/StopPoint/' + busStop + '/' + 'arrivals?app_id=' + appId + '&app_key=' + appKey, function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  if (parseInt(response.statusCode) === 404) {
    logger.fatal("incorrect bus stop code entered by user");
  }
  let arrivingBuses = JSON.parse(body);
  arrivingBuses = sortBusArrivals(arrivingBuses);
  
  console.log("These are the next 5 buses at: " + arrivingBuses[0].stationName)
  for (var i = 0; i < 5; i++) {
    let timeToLive = moment(arrivingBuses[i].timeToLive).fromNow();
    console.log(`${i + 1}: ${arrivingBuses[i].lineId} to ${arrivingBuses[i].destinationName} arrives ${timeToLive}`)
    // console.log(arrivingBuses[i].timeToLive);

  }

});
