 let postcode = 'NW1 8QA';

function getPostcodeLongLat(postcode) {
  return new Promise((resolve, reject) => {
    const postcodeLongLat = request(`https://api.postcodes.io/postcodes/${postcode}`, function (error, response, body){
                                  // console.log(error);
                                  // console.log(response);
                                  postcodeInfo = JSON.parse(body);

                                  postcodeLongLat[0] = postcodeInfo.result.longitude;
                                  postcodeLongLat[1] = postcodeInfo.result.latitude;
                                  postcodeLongLat = () => resolve(postcodeLongLat);
                                  error = () => reject(error);

                                })


  });
};

getPostcodeLongLat()
