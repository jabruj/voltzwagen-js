const server = 'http://localhost:3000/'
const intervalDelay = 1

const ctx0 = document.getElementById('outlet0').getContext('2d')
const ctx1 = document.getElementById('outlet1').getContext('2d')
const realTimeWindow = 20

////////////////////////////////////////
var chart0 = new Chart(ctx0, {
  type: 'line',

  data: {
    labels: new Array(realTimeWindow).fill().map((_, i) => i).map(_ => '|'),
    datasets: [{
      label: 'Real-TIme Power Consumption',
      backgroundColor: 'rgb(200, 200, 200)',
      borderColor: 'rgb(255, 99, 132)',
      data: new Array(realTimeWindow).fill().map((_, i) => i).map(_ => 0),
    }]
  },

  options: {}
})

var chart1 = new Chart(ctx1, {
  type: 'line',

  data: {
    labels: new Array(realTimeWindow).fill().map((_, i) => i).map(_ => '|'),
    datasets: [{
      label: 'Real-TIme Power Consumption',
      backgroundColor: 'rgb(200, 200, 200)',
      borderColor: 'rgb(255, 99, 132)',
      data: new Array(realTimeWindow).fill().map((_, i) => i).map(_ => 0),
    }]
  },

  options: {}
})

////////////////////////////////////////
fetchData = async () => {
  const response = await fetch(server + 'query-data')
  const body = await response.json()
  if (response.status !== 200) {
    throw Error(body.message)
  }
  return body
}

updateChart = data => {
  chart0.data.labels.push('|')
  chart0.data.datasets.forEach(dataset => {
    dataset.data.push(Math.random() * 10)
  })

  chart1.data.labels.push('|')
  chart1.data.datasets.forEach(dataset => {
    dataset.data.push(Math.random() * 10)
  })

  if (chart0.data.labels.length > realTimeWindow) {
    chart0.data.labels = chart0.data.labels.slice(
      chart0.data.labels.length - realTimeWindow)

    chart0.data.datasets.forEach(dataset => {
      dataset.data = dataset.data.slice(dataset.data.length - realTimeWindow)
    })
  }

  if (chart1.data.labels.length > realTimeWindow) {
    chart1.data.labels = chart1.data.labels.slice(
      chart1.data.labels.length - realTimeWindow)

    chart1.data.datasets.forEach(dataset => {
      dataset.data = dataset.data.slice(dataset.data.length - realTimeWindow)
    })
  }

  chart0.update()
  chart1.update()
}

////////////////////////////////////////
// fetchData().then(res => {
//   updateChart(res)
// })
this.timer = setInterval(() => {
  fetchData().then(res => {
    updateChart(res)
  })
}, intervalDelay * 1000)
