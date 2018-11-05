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
        TfL Unified API : https://api.tfl.gov.uk/
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



**Part 1: Bus Times (for a certain bus stop)**

Your program should:
  - ask the user for a stop code
      - takes a bus stop code as an input
  - print a list of the next five buses at that stop code
      - with their routes
      - destinations
      - time until they arrive in minutes

    Remember : ensure you're using a sensible module structure with well-named functions


JSON file from TfL does not list arriving buses in order of arrival. To do this we sort the array of arriving bus objects using a function called sortBusArrivals() using a comparison function we found at Stack Exchange (https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value).


**Part 2: Bus Stops (near a given postcode)**
