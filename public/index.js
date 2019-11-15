const server = 'http://localhost:3000/'
const intervalDelay = 1
const realTimeWindow = 20   // Number of readings for real-time chart
const pricePerkWh = 0.145   // 14.5 cents per kWh
const historyWindow = 14    // Number of days for history chart

////////// Power Charts //////////
const powerChartLabels = new Array(realTimeWindow).fill().map(
  (_, i) => i).map(_ => '|')

drawPowerCharts = i => {
  const ctx = document.getElementById('powerChart' + i).getContext('2d')
  var chart = new Chart(ctx, {
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
  return {
    'ctx': ctx,
    'chart': chart
  }
}

////////// kWh Charts //////////
const kWhChartOptions = {
  cutoutPercentage: 75,
  rotation: Math.PI,
  circumference: Math.PI
}

drawkWhCharts = i => {
  const ctx = document.getElementById('kWhChart' + i).getContext('2d')
  var chart = new Chart(ctx, {
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
  return {
    'ctx': ctx,
    'chart': chart
  }
}

////////// Price Charts //////////
const priceChartOptions = {
  cutoutPercentage: 75,
  rotation: Math.PI,
  circumference: Math.PI
}

drawPriceCharts = i => {
  const ctx = document.getElementById('priceChart' + i).getContext('2d')
  var chart = new Chart(ctx, {
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
  return {
    'ctx': ctx,
    'chart': chart
  }
}

////////// History Charts //////////
const historyChartLabels = new Array(historyWindow).fill().map(
  (_, i) => i).map(_ => '|')

drawHistoryCharts = i => {
  const ctx = document.getElementById('historyChart' + i).getContext('2d')
  var chart = new Chart(ctx, {
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
  return {
    'ctx': ctx,
    'chart': chart
  }
}

////////////////////////////////////////
drawCharts = i => {
  var powerChart = drawPowerCharts(i)
  var kWhChart = drawkWhCharts(i)
  var priceChart = drawPriceCharts(i)
  var historyChart = drawHistoryCharts(i)
  return {
    'powerCtx': powerChart['ctx'],
    'powerChart': powerChart['chart'],
    'kWhCtx': kWhChart['ctx'],
    'kWhChart': kWhChart['chart'],
    'priceCtx': priceChart['ctx'],
    'priceChart': priceChart['chart'],
    'historyCtx': historyChart['ctx'],
    'historyChart': historyChart['chart']
  }
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

getOutletPowerStates = async () => {
  const response = await fetch(server + 'outlet-power-states')
  const body = await response.json()
  if (response.status !== 200) {
    throw Error(body.message)
  }
  return body
}

updateCharts = (charts, data) => {
  let powerChart = charts['powerChart']
  let kWhCtx = charts['kWhCtx']
  let kWhChart = charts['kWhChart']
  let priceCtx = charts['priceCtx']
  let priceChart = charts['priceChart']

  let power = getPower(data)
  powerChart.data.labels.push('|')
  powerChart.data.datasets[0].data = power
  truncateData(powerChart)
  powerChart.update()

  let kWh = getkWh(power)
  kWhChart.data.datasets[0].data = [kWh]
  updatekWhLabel(kWhCtx, kWh)

  let price = getPrice(kWh)
  priceChart.data.datasets[0].data = [price]
  updatePriceLabel(priceCtx, price)
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
