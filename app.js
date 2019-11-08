const express = require('express')
const app = express()
const path = require('path')

const AWS = require('aws-sdk')
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

app.use('/public', express.static(__dirname + '/public'))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/query-data', (req, res) => {
  docClient.scan(dbParams, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      var body = {}
      body['0'] = formatOutletData('0', data.Items)
      body['1'] = formatOutletData('1', data.Items)
      res.send(body)
    }
  })
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})

////////////////////////////////////////
formatOutletData = (outletID, data) => {
  let items = data.filter(item => item.ID == outletID).map(item => item.Payload)
  var obj = {}
  items.forEach(item => {
    obj[item.timestamp] = {}
    obj[item.timestamp]['current'] = item['current']
    obj[item.timestamp]['voltage'] = item['voltage']
    obj[item.timestamp]['temperature'] = item['temperature']
  })
  return obj
}
