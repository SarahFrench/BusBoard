const request = require('request'),
      readline = require('readline-sync'),
      log4js = require('log4js'),
      moment = require('moment');

const BusStop = require('./classes.js').BusStop,
      Bus = require('./classes.js').Bus;

// Our API Credentials with TfL for 'Mumsnet Apprentices's App'
const appId = '84b66fad',
      appKey = 'd5c92ab3e708aee956adf533088ad795';

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

function getPostcodeLongLat(postcode) {
  return new Promise((resolve, reject) => {
    let postcodeLongLat = []
    request(`https://api.postcodes.io/postcodes/${postcode}`, function (error, response, body){
      // console.log(error);
      // console.log(response);
      postcodeInfo = JSON.parse(body);

      postcodeLongLat[0] = postcodeInfo.result.longitude;
      postcodeLongLat[1] = postcodeInfo.result.latitude;
      resolve(postcodeLongLat);
      reject(error);

      })
  });
}; //Returns a Promise, an array of [longitude, latitude] for the input postcode

function find2ClosestBusStops(postcodeLongLat){
  return new Promise ((resolve, reject) => {
    let stopTypes = "NaptanPublicBusCoachTram",
        radius = 1000,
        url = `https://api.tfl.gov.uk/StopPoint?stopTypes=${stopTypes}&radius=${radius}&lat=${postcodeLongLat[1]}&lon=${postcodeLongLat[0]}&app_id=${appId}&app_key=${appKey}`

    let nearbyStopCodes = [] //Array to be populated with first two nearby stops
    request(url, function (error, response, body){
      let parsedBody = JSON.parse(body);
      nearbyStopCodes[0] = parsedBody.stopPoints[0].naptanId;
      nearbyStopCodes[1] = parsedBody.stopPoints[1].naptanId;
      resolve(nearbyStopCodes);
      reject(error);
    })
  })} //Returns a Promise, an array of [StopCode1, Stopcode2]

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
} //Synchronous. Takes in the Objects of all arriving buses for a given stop, re-orders them into soonest to latest

function getArrivingBuses(nearbyStopCode) {
  return new Promise ((resolve, reject) => {
    let url = `https://api.tfl.gov.uk/StopPoint/${nearbyStopCode}/arrivals?app_id=${appId}&app_key=${appKey}`;
    request(url, function (error, response, body){
      if (parseInt(response.statusCode) === 404) {
        logger.fatal("incorrect bus stop code entered by user");
      } //Logging

      let arrivingBuses = JSON.parse(body);
      arrivingBuses = sortBusArrivals(arrivingBuses);
      // console.log(arrivingBuses[0]);
      resolve(arrivingBuses);
      reject(error);
    })
  })
} //Returns a Promise, takes in a StopCode and uses TfL API to get an array of arriving bus Objects

function getArrivingBusesPerStop(arrayOfBusStops){
  let arrayOfArrivalPromises = [];
  arrayOfBusStops.forEach(stopCode => {
      arrayOfArrivalPromises.push(getArrivingBuses(stopCode));
  })
  let arrayOfStopsArrivals = Promise.all(arrayOfArrivalPromises); //Promise.all is a promise itself
  return arrayOfStopsArrivals;
} //Returns a Promise, takes in an array of StopCodes, gets the array of arriving bus Objects and pushed into an array.
//First StopCode in input array => First list of arriving bus Object in output array;

function createBusStopObjects(arrayOfStopsArrivals){
  let listBusStops =[];

  let numberOfStops = arrayOfStopsArrivals.length;
  let currentStop, naptanId, stationName, numberOfBuses, vehicleId, lineName, destinationName, timeToLive, eTA;

  for (let stop = 0; stop < numberOfStops ; stop++){
    currentStop = arrayOfStopsArrivals[stop];

    naptanId = currentStop[0].naptanId;
    stationName = currentStop[0].stationName;
    fiveArrivingBuses = [];
    numberOfBuses = currentStop.length;

    for (let bus = 0; bus < Math.min(5, numberOfBuses); bus++) { //refactored using XXX
      vehicleId = currentStop[bus].vehicleId;
      lineName = currentStop[bus].lineName;
      destinationName = currentStop[bus].destinationName;
      timeToLive = currentStop[bus].timeToLive;
      eTA = moment(currentStop[bus].timeToLive).fromNow();

      newBusObject = new Bus(vehicleId, lineName, destinationName, timeToLive, eTA);
      fiveArrivingBuses.push(newBusObject);
    }

    newBusStopObject = new BusStop(postcode, naptanId, stationName, fiveArrivingBuses);

    listBusStops.push(newBusStopObject)
  }
  return listBusStops;
}

//=============================================================
//======================EXECUTABLE CODE========================




// console.log("Please enter a postcode eg. 'NW1 8QA'");
// let postcode = readline.prompt();
let postcode = 'NW1 8QA';
logger.info("User input taken")

function BusStopLocator(){
    return getPostcodeLongLat(postcode) //succinct version
            .then(find2ClosestBusStops) //put function name/function itself in here, not an invoked
            .then(getArrivingBusesPerStop)
            .then(createBusStopObjects)
  };

//
// getPostcodeLongLat(postcode) //more readable version
//     .then( longlat => { return find2ClosestBusStops(longlat); }) //put function name/function itself in here, not an invoked function
//     .then( nearbyStopCodes => { return getArrivingBusesPerStop(nearbyStopCodes); })
//     .then( arrayOfStopsArrivals => { return createBusStopObjects(arrayOfStopsArrivals); })

exports.BusStopLocator = BusStopLocator;
