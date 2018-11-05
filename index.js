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
// console.log("Please enter a bus stop number");
// let busStop = readline.prompt();
// let busStop = '490008660N'



console.log("Please enter a postcode eg. 'NW1 8QA'");
let postcode = readline.prompt();
// let postcode = 'NW1 8QA'
logger.info("User input taken")


findLongLat(postcode);


function findLongLat(postcode){
  let postcodeLongLat = []; //Longitude as first element, latitude as second element
  request(`https://api.postcodes.io/postcodes/${postcode}`, function (error, response, body){
    // console.log(error);
    // console.log(response);
    postcodeInfo = JSON.parse(body);

    postcodeLongLat[0] = postcodeInfo.result.longitude;
    postcodeLongLat[1] = postcodeInfo.result.latitude;

    // return postcodeLongLat
    findBusStop(postcodeLongLat)
  })
}

function findBusStop(postcodeLongLat){
  let nearbyStopCodes = []
  let stopTypes = "NaptanPublicBusCoachTram";
  let radius = 1000;

  request(`https://api-radon.tfl.gov.uk/StopPoint?stopTypes=${stopTypes}&radius=${radius}&lat=${postcodeLongLat[1]}&lon=${postcodeLongLat[0]}`, function (error, response, body){
    let parsedBody = JSON.parse(body)

    nearbyStopCodes[0] = parsedBody.stopPoints[0].naptanId;
    nearbyStopCodes[1] = parsedBody.stopPoints[1].naptanId;
    getArrivingBuses(nearbyStopCodes)
  })
}

function printStuff(x){
  console.log(x);
}



function getArrivingBuses(nearbyStopCodes) {
  let urlStopPoint;
  nearbyStopCodes.forEach(function(nearbyStopCode) {
    urlStopPoint = `https://api.tfl.gov.uk/StopPoint/${nearbyStopCode}/arrivals?app_id=${appId}&app_key=${appKey}`;
    request(urlStopPoint, function (error, response, body){
      // console.log('error:', error); // Print the error if one occurred
      // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      if (parseInt(response.statusCode) === 404) {
        logger.fatal("incorrect bus stop code entered by user");
      }
      let arrivingBuses = JSON.parse(body);
      arrivingBuses = sortBusArrivals(arrivingBuses);

      console.log("These are the next 5 buses at: " + arrivingBuses[0].stationName)
      let timeToLive;
      if (arrivingBuses.length >= 5) {
        for (var i = 0; i < 5; i++) {
          timeToLive = moment(arrivingBuses[i].timeToLive).fromNow();
          console.log(`${i + 1}: ${arrivingBuses[i].lineId} to ${arrivingBuses[i].destinationName} arrives ${timeToLive}`)
        }} else {
          arrivingBuses.forEach(function(bus){
            timeToLive = moment(bus.timeToLive).fromNow();
            console.log(`${i + 1}: ${bus.lineId} to ${bus.destinationName} arrives ${timeToLive}`)
          })
      }
    })
  })
}
