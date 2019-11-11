const server = 'http://localhost:3000/'
const intervalDelay = 1

const realTimeWindow = 20

////////////////////////////////////////
var ctx0 = document.getElementById('power0').getContext('2d')
var chart0 = new Chart(ctx0, {
  type: 'line',

  data: {
    labels: new Array(realTimeWindow).fill().map((_, i) => i).map(_ => '|'),
    datasets: [{
      label: 'Real-TIme Power Consumption for Outlet 0',
      backgroundColor: 'rgb(200, 200, 200)',
      borderColor: 'rgb(255, 99, 132)',
      data: new Array(realTimeWindow).fill().map((_, i) => i).map(_ => 0),
    }]
  },

  options: {}
})
ctx0 = document.getElementById('kWh0').getContext('2d')
var kWhChart0 = new Chart(ctx0, {
  type: 'doughnut',
  data: {
    datasets: [{
      data: [100]
    }],
    labels: ['Outlet 0 kWh']
  },
  options: {
    cutoutPercentage: 75,
    rotation: Math.PI,
    circumference: Math.PI,
  }
})

var ctx1 = document.getElementById('power1').getContext('2d')
var chart1 = new Chart(ctx1, {
  type: 'line',

  data: {
    labels: new Array(realTimeWindow).fill().map((_, i) => i).map(_ => '|'),
    datasets: [{
      label: 'Real-TIme Power Consumption for Outlet 1',
      backgroundColor: 'rgb(200, 200, 200)',
      borderColor: 'rgb(255, 99, 132)',
      data: new Array(realTimeWindow).fill().map((_, i) => i).map(_ => 0),
    }]
  },

  options: {}
})
ctx1 = document.getElementById('kWh1').getContext('2d')
var kWhChart1 = new Chart(ctx1, {
  type: 'doughnut',
  data: {
    datasets: [{
      data: [100]
    }],
    labels: ['Outlet 1 kWh']
  },
  options: {
    cutoutPercentage: 75,
    rotation: Math.PI,
    circumference: Math.PI,
  }
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
  let power0 = getPower(data[0])
  let power1 = getPower(data[1])
  chart0.data.labels.push('|')
  // chart0.data.datasets.forEach(dataset => {
  //   dataset.data.push(Math.random() * 10)
  // })
  chart0.data.datasets[0].data = power0

  chart1.data.labels.push('|')
  // chart1.data.datasets.forEach(dataset => {
  //   dataset.data.push(Math.random() * 10)
  // })
  chart1.data.datasets[0].data = power1

  truncateData(chart0)
  truncateData(chart1)
  chart0.update()
  chart1.update()

  let kWh0 = getkWh(power0)
  let kWh1 = getkWh(power1)
  document.getElementById('kWh0Label').innerText = kWh0
  document.getElementById('kWh1Label').innerText = kWh1
}

truncateData = chart => {
  if (chart.data.labels.length > realTimeWindow) {
    chart.data.labels = chart.data.labels.slice(
      chart.data.labels.length - realTimeWindow)

    chart.data.datasets.forEach(dataset => {
      dataset.data = dataset.data.slice(dataset.data.length - realTimeWindow)
    })
  }
}

getPower = outletData => {
  let current = outletData.map(item => item.current)
  let voltage = outletData.map(item => item.voltage)
  let temp = outletData.map(item => item.temperature)
  let power = current.map((n, i) => n * voltage[i])
  return power
}

getkWh = power => {
  var kWh = (power.reduce((a, b) => a + b) / power.length)
              / 1000 * (power.length / 3600)
  return Math.round(100000 * kWh) / 100000
}

////////////////////////////////////////
fetchData().then(res => {
  updateChart(res)
})
// this.timer = setInterval(() => {
//   fetchData().then(res => {
//     updateChart(res)
//   })
// }, intervalDelay * 1000)
