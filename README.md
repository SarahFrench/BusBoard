# BusBoard
**Bootcamp Project 3**

**Learning Goals:**
    The goals of this exercise are to learn about:
     - REST APIs, and how to call them
     - Promises
     - Building a simple website

For Promises, see: https://medium.freecodecamp.org/javascript-promises-explained-by-gambling-at-a-casino-28ad4c5b2573

**Tools:**
    Part 1:
        Example page : https://tfl.gov.uk/bus/stop/490015367S/lady-somerset-road
        TfL API : https://api-portal.tfl.gov.uk/signup
        Our login : CorndelStudents
            Password : Look in Slack messages Sarah&Mitesh
        NOTE: in URL make sure to use api.tfl.gov.uk not api-radon.tfl.gov.uk => radon isn't supported anymore and will error

    Part 2:
        Postcodes API : http://api.postcodes.io
        TfL "get a list of StopPoints within" feature

**Packages:**
    Part 1:
        WE need to create basic HTTP requests
        To do this:
          - Node package, isn't nice to use: http - https://nodejs.org/api/http.html
          - 3rd party package, nicer to use: request - https://www.npmjs.com/package/request
    Part 2:
    Part 3:
    Part 4:
          - express - https://expressjs.com/en/starter/hello-world.html



**Part 1: Bus Times (for a certain bus stop)**

Your program should:
  - ask the user for a stop code
      - takes a bus stop code as an input
  - print a list of the next five buses at that stop code
      - with their routes
      - destinations
      - time until they arrive in minutes

    Remember : ensure you're using a sensible module structure with well-named functions


JSON file from TfL does not list arriving buses in order of arrival. To do this
we sort the array of arriving bus objects using a function called sortBusArrivals()
using a comparison function we found at Stack Exchange (https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value).

Instead of using moment to calculate arrival time of bus relative to now, could
have used timeToStation property of bus objects. timeToStation: 620 = 620 seconds
until arrival.

**Part 2: Bus Stops (near a given postcode)**

1) Get longitude and latitude using postcode.io API
2) Get nearest bus stops from long/lat coordinates using TfL
    - Gets a list of StopPoints within {radius} by the specified criteria
    - ERROR IN SWAGGER OUTPUT: if URL contains &location.lat=xxx it doesn't work,
      but if URL contains &lat=xxx it does.
      https://api.tfl.gov.uk/swagger/ui/index.html#!/StopPoint/StopPoint_GetByGeoPoint

NOTE:
To make sure that different processes (e.g. loading info from TfL) occur in the
correct order we call functions from within functions (to force order of events
to be when variables have been assigned the required values). This can be changed
in future to use promises. If we weren't refactoring tomorrow, would need to change
function names as they aren't accurate.

User input postcode ==> findLongLat(postcode) =inside=> find2ClosestBusStops(postcodeLongLat)
=inside=> getArrivingBuses(nearbyStopCodes) =inside=> printArrivingBuses(arrivingBuses).

Everything is nested.


**Part 3: Promises - aka how to prevent the above nesting**

What needs to be addressed with Promises:
    - Latitude & Longitude data from postcodes.io API
    - Nearby Bus Stop information from TfL API
    - Arriving Buses for a given stop (done for each Bus Stop, currently 2)

Chaining promises:
  - https://html5hive.org/how-to-chain-javascript-promises/
  - https://javascript.info/promise-chaining

**Part 4: Using express**

Installed express via npm https://www.npmjs.com/package/express

Did Hello World exercise from https://expressjs.com/en/starter/hello-world.html
using express (express.js file). Open http://localhost:3000/ to see.

Link index.js to app.js with:

          const index = require('./index.js'); //At top of app.js

          exports.BusStopLocator = BusStopLocator; //At end of index.js

In app.js you can call on the BusStopLocator function in:

          app.get('/', (req, res) => {
            let output = index.BusStopLocator();
            output.then( x => {res.send(x)});
          });

Due to us using Promises in index.js, BusStopLocator() returns a Promise. So you
need to use the .then() function to properly use res.send() to print the Promise
returned from BusStopLocator() to the webpage.


Look up:
  -   HTML inputs into JS
  -   Query parameters go into express
