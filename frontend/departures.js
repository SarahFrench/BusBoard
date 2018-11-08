//can't use request, so using xhttp
let postcode;





// xhttp.open('GET', `http://localhost:3000/departureBoards?postcode=${postcode}`, true);  //true = return as JSON


function postBusInfo(postcode, arrivalInfo){

  document.querySelector("#message").innerHTML = `The next buses near you in ${postcode} are:`;


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


function clearNodes(arrivalInfo){
  for (let i = 1 ; i <= arrivalInfo.length ; i++){
    let myNode = document.querySelector(`#stop${i}_arrivals`)
    if (myNode !== null){
      while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
      }
    }
  }
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
      arrivalInfo = JSON.parse(response);

      clearNodes(arrivalInfo);
      postBusInfo(postcode, arrivalInfo);
  }
  xhttp.send();
}
