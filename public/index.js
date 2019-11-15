const server = 'http://localhost:3000/'
const intervalDelay = 1
const realTimeWindow = 20   // Number of readings for real-time chart
const pricePerkWh = 0.145   // 14.5 cents per kWh
const historyWindow = 14    // Number of days for history chart


////////////////////////////////////////
drawCharts = i => {
  drawPowerCharts(i)
  drawkWhCharts(i)
  drawPriceCharts(i)
  drawHistoryCharts(i)
}

////////// Power Charts //////////
const powerChartLabels = new Array(realTimeWindow).fill().map(
  (_, i) => i).map(_ => '|')

drawPowerCharts = i => {
  const powerCtx = document.getElementById('powerChart' + i).getContext('2d')
  var powerChart = new Chart(powerCtx, {
    type: 'line',
    data: {
      datasets: [{
        label: 'Real-Time Power Consumption',
        backgroundColor: 'rgb(200, 200, 200)',
        borderColor: 'rgb(255, 99, 132)',
        data: new Array(realTimeWindow).fill().map((_, i) => i).map(_ => 0),
      }],
      labels: powerChartLabels
    },
    options: {
      title: {
        display: true,
        text: 'Outlet ' + i
      }
    }
  })
}

////////// kWh Charts //////////
const kWhChartOptions = {
  cutoutPercentage: 75,
  rotation: Math.PI,
  circumference: Math.PI
}

drawkWhCharts = i => {
  const kWhCtx = document.getElementById('kWhChart' + i).getContext('2d')
  var kWhChart = new Chart(kWhCtx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [1],
        backgroundColor: 'rgba(255, 255, 0, 0.5)',
      }],
      labels: ['Outlet ' + i + ' kWh']
    },
    options: kWhChartOptions
  })
}

////////// Price Charts //////////
const priceChartOptions = {
  cutoutPercentage: 75,
  rotation: Math.PI,
  circumference: Math.PI
}

drawPriceCharts = i => {
  const priceCtx = document.getElementById('priceChart' + i).getContext('2d')
  var priceChart = new Chart(priceCtx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [1],
        backgroundColor: 'rgba(0, 255, 0, 0.5)',
      }],
      labels: ['Outlet ' + i + ' Cost']
    },
    options: priceChartOptions
  })
}

////////// History Charts //////////
const historyChartLabels = new Array(historyWindow).fill().map(
  (_, i) => i).map(_ => '|')

drawHistoryCharts = i => {
  const historyCtx = document.getElementById('historyChart' + i).getContext('2d')
  var historyChart = new Chart(historyCtx, {
    type: 'bar',
    data: {
      datasets: [{
        label: 'Daily Power Consumption',
        backgroundColor: 'rgb(200, 200, 200)',
        data: new Array(realTimeWindow).fill().map((_, i) => i).map(_ => 1),
      }],
      labels: historyChartLabels
    },
    options: {
      title: {
        display: true,
        text: 'Outlet ' + i + ' Usage History'
      }
    }
  })
}

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
  let power1 = getPower(data[0])
  let power2 = getPower(data[1])

  powerChart1.data.labels.push('|')
  powerChart1.data.datasets[0].data = power1

  powerChart2.data.labels.push('|')
  powerChart2.data.datasets[0].data = power2

  truncateData(powerChart1)
  truncateData(powerChart2)
  powerChart1.update()
  powerChart2.update()

  let kWh1 = getkWh(power1)
  let kWh2 = getkWh(power2)
  kWhChart1.data.datasets[0].data = [kWh1]
  kWhChart2.data.datasets[0].data = [kWh2]
  updatekWhLabel(kWhCtx1, kWh1)
  updatekWhLabel(kWhCtx2, kWh2)

  let price1 = getPrice(kWh1)
  let price2 = getPrice(kWh2)
  kWhChart1.data.datasets[0].data = [price1]
  kWhChart2.data.datasets[0].data = [price2]
  updatePriceLabel(priceCtx1, price1)
  updatePriceLabel(priceCtx2, price2)
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
  return Math.round(1000 * kWh) / 1000
}

getPrice = kWh => {
  var price = pricePerkWh * kWh
  return Math.round(1000 * price) / 1000
}

updatekWhLabel = (ctx, kWh) => {
  ctx.font = '26px Arial'
  ctx.fillText(kWh + ' kWh', 115, 120)
}

updatePriceLabel = (ctx, price) => {
  ctx.font = '26px Arial'
  ctx.fillText('$' + price, 140, 120)
}

sendCommand = async(event) => {
  var outlet = ''
  var command = ''

  if (parseInt(event.srcElement.id[event.srcElement.id.length - 1]) == 1) {
    outlet = '1'
  } else {
    outlet = '2'
  }

  if (event.srcElement.id.includes('onButton')) {
    command = '1'
  } else {
    command = '0'
  }

  const query = '/?outlet=' + outlet + '&command=' + command
  await fetch(server + 'send-command' + query)
}

////////////////////////////////////////
// fetchData().then(res => {
//   updateChart(res)
// })
// this.timer = setInterval(() => {
//   fetchData().then(res => {
//     updateChart(res)
//   })
// }, intervalDelay * 1000)
