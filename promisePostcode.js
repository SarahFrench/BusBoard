const request = require('request');
const readline = require('readline-sync');
const log4js = require('log4js');
const moment = require('moment');

// Our API Credentials with TfL for 'Mumsnet Apprentices's App'
const appId = '84b66fad';
const appKey = 'd5c92ab3e708aee956adf533088ad795';

let postcode = 'NW1 8QA';

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
}; //Promise

function find2ClosestBusStops(postcodeLongLat){
  return new Promise ((resolve, reject) => {
    let stopTypes = "NaptanPublicBusCoachTram",
        radius = 1000,
        url = `https://api.tfl.gov.uk/StopPoint?stopTypes=${stopTypes}&radius=${radius}&lat=${postcodeLongLat[1]}&lon=${postcodeLongLat[0]}`

    let nearbyStopCodes = [] //Array to be populated with first two nearby stops

    request(url, function (error, response, body){
      let parsedBody = JSON.parse(body);

      nearbyStopCodes[0] = parsedBody.stopPoints[0].naptanId;
      nearbyStopCodes[1] = parsedBody.stopPoints[1].naptanId;
      resolve(nearbyStopCodes);
      reject(error);
    })
  })} //Promise

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
}


busstops = ['490007927M', '490011755S'];

function getArrivingBusesPerStop(arrayOfBusStops){
  let arrayOfArrivalPromises = [];
  arrayOfBusStops.forEach(stopCode => {
      arrayOfArrivalPromises.push(getArrivingBuses(stopCode));
  })
  let arrayOfArrivals = Promise.all(arrayOfArrivalPromises); //Promise.all is a promise itself
  return arrayOfArrivals;
}

getArrivingBusesPerStop(busstops).then( x => {console.log(x);});


// getPostcodeLongLat(postcode) //succinct version
//     .then(find2ClosestBusStops) //put function name/function itself in here, not an invoked function

//
getPostcodeLongLat(postcode) //more readable version
    .then( longlat => { return find2ClosestBusStops(longlat) }) //put function name/function itself in here, not an invoked function
    .then( nearbyStopCodes => { let arrivingBuses = [];
                                nearbyStopCodes.forEach( stopCode => {
                                                                        getArrivingBuses(stopCode)
                                                                      });
                                return arrivingBuses
                              })
