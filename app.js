const readline = require('readline-sync');
const index = require('./index.js');

const express = require('express')
const app = express()
const port = 3000


app.title = "Sarah & Mitesh's BusBoard";


app.get('/', (req, res) => {
  let output = index.BusStopLocator();
  output.then( x => {res.send(x)});
});


//
//
//
// app.post()
// app.get('/departureBoards', (req, res) => {
//
//   //CODE FOR ACCESSING APIS AND GENERATING OUTPUT TO PRINT/TURN INTO HTML
//
//   res.send("output string or html")
// });


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
