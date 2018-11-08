//can't use request, so using xhttp
let postcode;





// xhttp.open('GET', `http://localhost:3000/departureBoards?postcode=${postcode}`, true);  //true = return as JSON


function postBusInfo(arrivalInfo){
  // let busStop1 = arrivalInfo[0],
  //     busStop2 = arrivalInfo[1];

  let node,
      textnode,
      busStop;

    for (let i = 1 ; i <= arrivalInfo.length ; i++){
      busStop = arrivalInfo[i-1]
      document.querySelector(`#stop${i}_name`).innerHTML = busStop.stationName;

      busStop.fiveArrivingBuses.forEach( bus => {
      node = document.createElement("LI");                 // Create a <li> node
      textnode = document.createTextNode(`${bus.lineName} to ${bus.destinationName} arrives ${bus.eTA}`);    // Create a text node
      node.appendChild(textnode);                              // Append the text to <li>
      document.querySelector(`#stop${i}_arrivals`).appendChild(node);
      })
    }
}


function clearNodes(){
  
}





function sendPostcodeRequestToAPI() {


  let formData = new FormData(document.forms.postcodeForm);
  postcode = formData.get('postcode');
  postcode = postcode.toUpperCase().replace(/\s/g, ""); //remove any whitespace

  console.log(`http://localhost:3000/departureBoards?postcode=${postcode}`);

  var xhttp = new XMLHttpRequest();
  xhttp.open('GET', `http://localhost:3000/departureBoards?postcode=${postcode}`, true);  //true = return as JSON
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.onload = function() {
      // Handle response here using e.g. xhttp.status, xhttp.response, xhttp.responseText
      let response = xhttp.response;
      response = JSON.parse(response);

      postBusInfo(response);

  }

  xhttp.send();
}
