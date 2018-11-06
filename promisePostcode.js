const request = require('request');


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
};

getPostcodeLongLat(postcode)
    .then( (x) => console.log(x)) //works
    .then( (x) => console.log(`${x} is the longlat info`)) //doens't work - Why?
