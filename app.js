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

app.use('/public', express.static(__dirname + '/public'))

queryData(docClient)
app.get('/', function (req, res) {
  // data = queryData(docClient)
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})

////////////////////////////////////////////////////////////////////////////////
function queryData(docClient) {
  let params = {
    TableName: 'VoltzwagenTable',
    ProjectionExpression: 'ID, #ts, Payload',
    ExpressionAttributeNames: {
      '#ts': 'Timestamp',
    },
  }

  docClient.scan(params, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      console.log(data.Items)
    }
  })
}
