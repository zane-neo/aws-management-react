const express = require('express')
const request = require('request')
const zlib = require('zlib')

const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  res.header("content-type", "application/json")
  next()
})

app.get('/_cat/plugins', (req, res) => {
  console.log("received request type is:" + req.params.length + ", request query is:" + req.query.length)
  request(
    //https://stackoverflow.com/a/28583320 adding gzip here can solve the response compressed issue.
    { url: 'http://localhost:9200/_cat/plugins?format=json', headers: {...req.headers}, gzip: true},
    (error, response) => {
      console.log("response is:" + JSON.stringify(response))
      if (response.statusCode != 200) {
        return res.status(response.statusCode).json({ error: JSON.parse(response.body)})
      }
      console.log("body.body type is:" +typeof(response.body))
      res.json(JSON.parse(response.body))

    }
  )
})

const PORT = process.env.PORt || 3000;
app.listen(PORT, ()=> console.log(`listening on ${PORT}`))
