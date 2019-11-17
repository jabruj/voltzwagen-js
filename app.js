const express = require('express')
const app = express()
const path = require('path')

const AWS = require('aws-sdk')
const publishMessage = require('aws-mqtt/lib/publishMessage')

AWS.config.update({
  region: 'us-east-1',
  endpoint: 'https://dynamodb.us-east-1.amazonaws.com',
})
AWS.config.loadFromPath('./config.json')
const docClient = new AWS.DynamoDB.DocumentClient()
const dbParams = {
  TableName: 'VoltzwagenTable',
  ProjectionExpression: 'ID, #ts, Payload',
  ExpressionAttributeNames: {
    '#ts': 'Timestamp',
  },
}

var outletPowerStates = {
  '1': '1',
  '2': '1'
}

////////////////////////////////////////
app.use('/public', express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/query-data', (req, res) => {
  docClient.scan(dbParams, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      var body = {}
      body['1'] = formatOutletData('1', data.Items)
      body['2'] = formatOutletData('2', data.Items)
      res.send(body)
    }
  })
})

app.get('/send-command', (req, res) => {
  const endpoint = 'a1qz7xag1ojn3f-ats.iot.us-east-1.amazonaws.com'
  const topic = '$aws/things/VoltzwagenThing/shadow/get'
  const message = '' + req.query.outlet + req.query.command
  publishMessage(
    {
      region: AWS.config.region,
      endpoint: endpoint,
      credentials: AWS.config.credentials,
    },
    topic,
    message
  ).then(() => {
    outletPowerStates[req.query.outlet] = req.query.command
    res.send(message)
  })
})

app.get('/outlet-power-states', (req, res) => {
  res.send(outletPowerStates)
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})

////////////////////////////////////////
formatOutletData = (outletID, data) => {
  let items = data.filter(item => item.ID == outletID).map(item => item.Payload)
  return items
}
