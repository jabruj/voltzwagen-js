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
      data = data.Items.sort((a, b) => {
        return a.timestamp > b.timestamp
      })
      var items = []
      data.forEach(item => {
        items.push(item['Payload'])
      })
      res.send(items)
    }
  })
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})
