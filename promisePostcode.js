const request = require('request');
let postcode = 'NW1 8QA';
let postcodeLongLat =[-0.143889,51.544011];


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
};

function find2ClosestBusStops(postcodeLongLat){
  return new Promise ((resolve, reject) => {
    let nearbyStopCodes = []
    let stopTypes = "NaptanPublicBusCoachTram";
    let radius = 1000;

    request(`https://api.tfl.gov.uk/StopPoint?stopTypes=${stopTypes}&radius=${radius}&lat=${postcodeLongLat[1]}&lon=${postcodeLongLat[0]}`, function (error, response, body){
      console.log(body);
      let parsedBody = JSON.parse(body);

      nearbyStopCodes[0] = parsedBody.stopPoints[0].naptanId;
      nearbyStopCodes[1] = parsedBody.stopPoints[1].naptanId;
      resolve(nearbyStopCodes);
      reject(error);
    })
  })
}


getPostcodeLongLat(postcode) //succinct version
    .then(find2ClosestBusStops) //put function name/function itself in here, not an invoked function


getPostcodeLongLat(postcode) //more readable version
    .then( longlat => { return find2ClosestBusStops(longlat) }; ) //put function name/function itself in here, not an invoked function
    .then( nearbyStopCodes => {console.log(nearbyStopCodes)})
