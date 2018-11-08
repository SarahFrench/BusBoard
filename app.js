const readline = require('readline-sync');
const BusStopLocator = require('./index.js').BusStopLocator;

const express = require('express')
const app = express()
const port = 3000


app.title = "Sarah & Mitesh's BusBoard";


app.use(express.static('frontend'));

app.get('/departureBoards', (req, res) => {
  let output = BusStopLocator('SW13HX');
  output.then( x => {res.send(x)});
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
