const request = require('request');
const readline = require('readline-sync');
const log4js = require('log4js');
const moment = require('moment');

// Our API Credentials with TfL for 'Mumsnet Apprentices's App'
const appId = '84b66fad';
const appKey = 'd5c92ab3e708aee956adf533088ad795';

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

//=============================================================
//==========================FUNCTIONS==========================

function findLongLat(postcode){
  let postcodeLongLat = []; //Longitude as first element, latitude as second element
  request(`https://api.postcodes.io/postcodes/${postcode}`, function (error, response, body){
    // console.log(error);
    // console.log(response);
    postcodeInfo = JSON.parse(body);

    postcodeLongLat[0] = postcodeInfo.result.longitude;
    postcodeLongLat[1] = postcodeInfo.result.latitude;

    find2ClosestBusStops(postcodeLongLat) //Edit this when Promises used?
  })
}

function find2ClosestBusStops(postcodeLongLat){
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

function getArrivingBuses(nearbyStopCodes) {
  let urlStopPoint;

  console.log(`\nThe nearest 2 bus stops to ${postcode} are: \n`) //console logs the bus stop name for the first bus arriving at the bus stop

  nearbyStopCodes.forEach(function(nearbyStopCode) {
    urlStopPoint = `https://api.tfl.gov.uk/StopPoint/${nearbyStopCode}/arrivals?app_id=${appId}&app_key=${appKey}`;
    request(urlStopPoint, function (error, response, body){ //iterating through the two bus stops
      // console.log('error:', error); // Print the error if one occurred
      // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      if (parseInt(response.statusCode) === 404) {
        logger.fatal("incorrect bus stop code entered by user");
      }

      let arrivingBuses = JSON.parse(body);
      arrivingBuses = sortBusArrivals(arrivingBuses);

      printArrivingBuses(arrivingBuses);
    })
  })
}

function printArrivingBuses(arrivingBuses){

  console.log(`\n${arrivingBuses[0].stationName}`) //console logs the bus stop name for the first bus arriving at the bus stop

  let timeToLive;

  for (let i = 0; i < Math.min(5,arrivingBuses.length); i++) { //refactored using XXX
    timeToLive = moment(arrivingBuses[i].timeToLive).fromNow();
    console.log(`\t${i + 1}: ${arrivingBuses[i].lineId} to ${arrivingBuses[i].destinationName} arrives ${timeToLive}`)
  }
}

//=============================================================
//======================EXECUTABLE CODE========================

// console.log("Please enter a bus stop number");
// let busStop = readline.prompt();
// let busStop = '490008660N'



console.log("Please enter a postcode eg. 'NW1 8QA'");
let postcode = readline.prompt();
// let postcode = 'NW1 8QA'
logger.info("User input taken")


findLongLat(postcode);
