class BusStop {
  constructor(postcode, naptanId, stationName, fiveArrivingBuses){
    this.postcode = postcode;
    this.naptanId = naptanId;
    this.stationName = stationName;
    this.fiveArrivingBuses = fiveArrivingBuses;
  }

  // function describeSelf(){
  //   //return a string with info in
  // }
}

class Bus {
  constructor(vehicleId, lineName, destinationName, timeToLive, eTA){
    this.vehicleId = vehicleId;
    this.lineName = lineName;
    this.destinationName = destinationName;
    this.timeToLive = timeToLive;
    this.eTA = eTA
  }

}


//Because I'm exporting more than one Class from this file I need to be more specific in the below export objects:

exports.BusStop = BusStop;
exports.Bus = Bus;
