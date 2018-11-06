READING:
Synchronous vs. Asynchronous programming :
            https://www.datchley.name/asynchronous-in-the-browser/
Asynchronous vs Multithreading :      
            https://stackoverflow.com/questions/8963209/does-async-programming-mean-multi-threading
Promises :
          https://www.datchley.name/es6-promises/  

Event handlers :
          https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events

================================================================


**1) Synchronous vs. Asynchronous programming**
See : https://www.datchley.name/asynchronous-in-the-browser/

      **Synchronous programming**: One task follows another, and a task only starts
      when the previous one finishes. Code is executed line by line.
      Synchronous programming also includes chaining functions, so the
      different 'steps' of a script call on each other in the correct order.
      You can chain functions by nesting them or using callback functions
      (to effectively nest them).

      **Asynchronous programming**: A task takes too long, probably by accessing
      a remote resource like an API. Or it has a setTimeout() function forcing
      it to behave asynchronously. When a function behaves asynchronously
      it'll "immediately return, so as not to block the main execution thread".
      I.e. the script HAS to keep going even if a process (e.g. accessing
      BusStop data from TfL) hasn't finished. If the next task in the script
      relies on data returned by an asynchronous task it'll fail, as it's
      calling on a value that hasn't been returned yet.

      You can avoid this by passing an asynchronous function callback functions.
      This way, those functions are only executed once the asynchronous process
      is finished. Basically:

                a = 3;
                b = aSyncFunction(a);
                c = syncFunction(b);      => fails due to aSyncFunction not assigning
                                          a value to 'b' before syncFunction tries
                                          to access it
                a = 3;
                c = aSyncFunction(a, syncFunction);

                                      => by passing syncFunction to aSyncFunction
                                      as a callback function, you force syncFunction
                                      to only start doing things with the output
                                      of aSyncFunction ('b') once that process is
                                      finished

      If you have lots of asynchronous functions this can get ugly.

Continuation Passing Style
      This is a way of writing your functions to use callback functions in
      a clean way, and avoid "callback hell".


=============//DIDN'T FINISH READING THAT ARTICLE//=============


================================================================



**2) Promises**

See: https://www.datchley.name/es6-promises/

 - Promises are an easier alternative to callback functions when handling asynchronous programming.
 - Promises help us handle asynchronous processes, and make them more synchronous-like.
 - Like the name suggests, a 'promise' represents a value that will be useable in future.
      - It's an IOU
 - Promises are:
       - Immutable
       - We are "guaranteed to receive the values, regardless of when we register a handler for it, even if it's already resolved"

**Making a Promise**
  - create a new Promise using the new Promise constructor()

          let p = new Promise(parameters here)

  - this constructor accepts a handler (like event handlers - blocks of code that runs when the event fires).
       - This handler takes two functions as parameters, typically named resolve and reject.
       - Resolve: calls the future value when it's already
       - Reject: rejects the Promise if it can't resolve its future value

          let p = new Promise(function(resolve, reject) {  
            if (//condition//) {
              resolve(//value//);  // fulfilled successfully
            } else {
              reject(//reason//);  // error, rejected
            }
          });

**Promise states**:
 - Pending
 - Fulfilled - when the resolve handler is called
 - Rejected - when the second handler, reject, is called

A promise can only become 'settled' (either fulfilled or rejected) once. This is what makes it Immutable

You can create a Promise that's immediately resolved, e.g.:

          let p = Promise.resolve(42);

**Consuming Promises**
  - Promises can be passed around as a stand-in for a value. They can be used in
    any way like a variable/value : returned from functions, passed as parameter,
    etc.
  - When doing this we need to add the handler .then(). We pass .then() a function
    which will use the value of the Promise once it's Fulfilled.
  - .then() actually can take two parameters
       - a function to use the Promise's value once it's Fulfilled.
       - a function to be called if the Promise is Rejected.
       - you can leave either of these as null .then(null, (val)) .then((val), null)
            - if you only want to do something if the Promise is Rejected, you
              can use .catch(), which takes only one parameter: a function
              for if the Promise is Rejected. .catch((val)) === .return(null, (val))

**Errors**
  - Use .catch() for these; it's explicit
  - More info on this in the ARTICLE

**Composing Promises**

Promise.all()
  - If you're wanting to use several Promises for a process you can ensure they're
    all Fulfilled together by using Promise.all()
        - Promise.all() takes an array of Promises and waits until they're ALL Fulfilled.
        - If any Promises inside Promise.all() are rejected, the entire Promise.all() will be rejected.
        - Promise.all() is a Promise itself?

Promise.race()
    - This Promise is Fulfilled once the first Promise in the array is Fulfilled.
