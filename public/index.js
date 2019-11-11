const server = 'http://localhost:3000/'
const intervalDelay = 1

const realTimeWindow = 20

////////// Power Charts //////////
const powerChartDatasets = [{
  label: 'Real-Time Power Consumption',
  backgroundColor: 'rgb(200, 200, 200)',
  borderColor: 'rgb(255, 99, 132)',
  data: new Array(realTimeWindow).fill().map((_, i) => i).map(_ => 0),
}]
const powerChartLabels = new Array(realTimeWindow).fill().map(
  (_, i) => i).map(_ => '|')

var ctx0 = document.getElementById('powerChart0').getContext('2d')
var ctx1 = document.getElementById('powerChart1').getContext('2d')
var powerChart0 = new Chart(ctx0, {
  type: 'line',
  data: {
    datasets: powerChartDatasets,
    labels: powerChartLabels
  },
  options: {
    title: {
      display: true,
      text: 'Outlet 0'
    }
  }
})
var powerChart1 = new Chart(ctx1, {
  type: 'line',
  data: {
    datasets: powerChartDatasets,
    labels: powerChartLabels
  },
  options: {
    title: {
      display: true,
      text: 'Outlet 1'
    }
  }
})

////////// kWh Charts //////////
const kWhChartDatasets = [{
  data: [100],
  backgroundColor: 'rgba(255, 0, 0, 0.1)',
}]
const kWhChartOptions = {
  cutoutPercentage: 75,
  rotation: Math.PI,
  circumference: Math.PI
}

ctx0 = document.getElementById('kWhChart0').getContext('2d')
ctx1 = document.getElementById('kWhChart1').getContext('2d')
var kWhChart0 = new Chart(ctx0, {
  type: 'doughnut',
  data: {
    datasets: kWhChartDatasets,
    labels: ['Outlet 0 kWh']
  },
  options: kWhChartOptions
})
var kWhChart1 = new Chart(ctx1, {
  type: 'doughnut',
  data: {
    datasets: kWhChartDatasets,
    labels: ['Outlet 1 kWh']
  },
  options: kWhChartOptions
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
  powerChart0.data.labels.push('|')
  // powerChart0.data.datasets.forEach(dataset => {
  //   dataset.data.push(Math.random() * 10)
  // })
  powerChart0.data.datasets[0].data = power0

  powerChart1.data.labels.push('|')
  // powerChart1.data.datasets.forEach(dataset => {
  //   dataset.data.push(Math.random() * 10)
  // })
  powerChart1.data.datasets[0].data = power1

  truncateData(powerChart0)
  truncateData(powerChart1)
  powerChart0.update()
  powerChart1.update()

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
