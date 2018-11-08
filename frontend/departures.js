//can't use request, so using xhttp

var xhttp = new XMLHttpRequest();

xhttp.open('GET', 'http://localhost:3000/departureBoards?postcode=nw51tl', true);  //true = return as JSON

xhttp.setRequestHeader('Content-Type', 'application/json');

xhttp.onload = function() {
    // Handle response here using e.g. xhttp.status, xhttp.response, xhttp.responseText
    console.log(xhttp.response);
}

xhttp.send();
