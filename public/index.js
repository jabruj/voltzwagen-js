const server = 'http://localhost:3000/'
// const server = 'http://voltzwagen.us-east-1.elasticbeanstalk.com/'
const intervalDelay = 2
const realTimeWindow = 20   // Number of readings for real-time chart
const pricePerkWh = 0.145   // 14.5 cents per kWh
const historyWindow = 5     // Number of days for history chart

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
        label: 'Daily Power Consumption (kWh)',
        backgroundColor: 'rgba(255, 255, 0, 0.5)',
        data: new Array(realTimeWindow).fill().map((_, i) => i).map(_ => 0),
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

drawCostHistoryCharts = i => {
  const ctx = document.getElementById('costHistoryChart' + i).getContext('2d')
  var chart = new Chart(ctx, {
    type: 'bar',
    data: {
      datasets: [{
        label: 'Daily Cost',
        backgroundColor: 'rgba(0, 255, 0, 0.5)',
        data: new Array(realTimeWindow).fill().map((_, i) => i).map(_ => 0),
      }],
      labels: historyChartLabels
    },
    options: {
      title: {
        display: true,
        text: 'Outlet ' + i + ' Cost History'
      }
    }
  })
  return {
    'ctx': ctx,
    'chart': chart
  }
}

////////// History Summary Charts //////////
drawHistorySummaryChart = () => {
  const ctx = document.getElementById('historySummaryChart').getContext('2d')
  var chart = new Chart(ctx, {
    type: 'bar',
    data: {
      datasets: [
        {
          label: 'Outlet 1',
          backgroundColor: 'rgba(255, 99, 97, 1)',
          data: new Array(realTimeWindow).fill().map((_, i) => i).map(_ => 0),
        },
        {
          label: 'Outlet 2',
          backgroundColor: 'rgba(0, 63, 92, 1)',
          data: new Array(realTimeWindow).fill().map((_, i) => i).map(_ => 0),
        }
      ],
      labels: historyChartLabels
    },
    options: {
      title: {
        display: true,
        text: 'Daily Power Usage (kWh)'
      },
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          stacked: true
        }]
      }
    }
  })
  return {
    'ctx': ctx,
    'chart': chart
  }
}

drawCostHistorySummaryChart = () => {
  const ctx = document.getElementById('costHistorySummaryChart').getContext('2d')
  var chart = new Chart(ctx, {
    type: 'bar',
    data: {
      datasets: [
        {
          label: 'Outlet 1',
          backgroundColor: 'rgba(88, 80, 141, 1)',
          data: new Array(realTimeWindow).fill().map((_, i) => i).map(_ => 0),
        },
        {
          label: 'Outlet 2',
          backgroundColor: 'rgba(188, 80, 144, 1)',
          data: new Array(realTimeWindow).fill().map((_, i) => i).map(_ => 0),
        }
      ],
      labels: historyChartLabels
    },
    options: {
      title: {
        display: true,
        text: 'Daily Power Costs'
      },
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          stacked: true
        }]
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
  var costHistoryChart = drawCostHistoryCharts(i)
  return {
    'powerCtx': powerChart['ctx'],
    'powerChart': powerChart['chart'],
    'kWhCtx': kWhChart['ctx'],
    'kWhChart': kWhChart['chart'],
    'kWhLabel': document.getElementById('kWhLabel' + i),
    'priceCtx': priceChart['ctx'],
    'priceChart': priceChart['chart'],
    'priceLabel': document.getElementById('priceLabel' + i),
    'historyCtx': historyChart['ctx'],
    'historyChart': historyChart['chart'],
    'costHistoryCtx': costHistoryChart['ctx'],
    'costHistoryChart': costHistoryChart['chart']
  }
}

drawSummaryCharts = i => {
  var historySummaryChart = drawHistorySummaryChart()
  var costHistorySummaryChart = drawCostHistorySummaryChart()
  return {
    'historySummaryCtx': historySummaryChart['ctx'],
    'historySummaryChart': historySummaryChart['chart'],
    'costHistorySummaryCtx': costHistorySummaryChart['ctx'],
    'costHistorySummaryChart': costHistorySummaryChart['chart']
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
  let kWhChart = charts['kWhChart']
  let kWhLabel = charts['kWhLabel']
  let priceLabel = charts['priceLabel']
  let priceChart = charts['priceChart']
  let historyChart = charts['historyChart']
  let costHistoryChart = charts['costHistoryChart']

  let power = getPower(data)
  powerChart.data.labels.push('|')
  powerChart.data.datasets[0].data = power
  truncateData(powerChart)
  powerChart.update()

  let kWh = getkWh(power)
  kWhChart.data.datasets[0].data = [kWh]
  updatekWhLabel(kWhLabel, kWh)

  let price = getPrice(kWh)
  priceChart.data.datasets[0].data = [price]
  updatePriceLabel(priceLabel, price)

  let history = getHistory(data)
  historyChart.data.labels = Object.keys(history).map(key =>
    new Date(key)).map(date => (date.getMonth() + 1) + '-' + date.getDate())
  historyChart.data.datasets[0].data = new Array(historyWindow).fill(0)

  costHistoryChart.data.labels = Object.keys(history).map(key =>
    new Date(key)).map(date => (date.getMonth() + 1) + '-' + date.getDate())
  costHistoryChart.data.datasets[0].data = new Array(historyWindow).fill(0)

  Object.keys(history).forEach((key, i) => {
    let power = getPower(history[key])
    let kWh = getkWh(power)
    let price = getPrice(kWh)
    historyChart.data.datasets[0].data[i] = kWh
    costHistoryChart.data.datasets[0].data[i] = price
  })

  historyChart.update()
  costHistoryChart.update()
}

updateSummaryCharts = (charts, data) => {
  let historySummaryChart = charts['historySummaryChart']
  let costHistorySummaryChart = charts['costHistorySummaryChart']

  let history1 = getHistory(data['1'])
  let history2 = getHistory(data['2'])

  historySummaryChart.data.labels = Object.keys(history1).map(key =>
    new Date(key)).map(date => (date.getMonth() + 1) + '-' + date.getDate())
  historySummaryChart.data.datasets[0].data = new Array(historyWindow).fill(0)
  historySummaryChart.data.datasets[1].data = new Array(historyWindow).fill(0)

  costHistorySummaryChart.data.labels = Object.keys(history1).map(key =>
    new Date(key)).map(date => (date.getMonth() + 1) + '-' + date.getDate())
  costHistorySummaryChart.data.datasets[0].data = new Array(historyWindow).fill(0)
  costHistorySummaryChart.data.datasets[1].data = new Array(historyWindow).fill(0)

  Object.keys(history1).forEach((key, i) => {
    let power1 = getPower(history1[key])
    let kWh1 = getkWh(power1)
    let price1 = getPrice(kWh1)
    historySummaryChart.data.datasets[0].data[i] = kWh1
    costHistorySummaryChart.data.datasets[0].data[i] = price1
  })
  Object.keys(history2).forEach((key, i) => {
    let power2 = getPower(history2[key])
    let kWh2 = getkWh(power2)
    let price2 = getPrice(kWh2)
    historySummaryChart.data.datasets[1].data[i] = kWh2
    costHistorySummaryChart.data.datasets[1].data[i] = price2
  })

  historySummaryChart.update()
  costHistorySummaryChart.update()
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
  let power = outletData.map(item => item.power)
  return power
}

getkWh = power => {
  var kWh = (power.reduce((a, b) => a + b) / power.length)
              / 1000 * (power.length / 3600)
  return Math.round(1000 * kWh) / 1000
}

updatekWhLabel = (label, kWh) => {
  label.innerText = kWh + ' kWh'
}

getPrice = kWh => {
  var price = pricePerkWh * kWh
  return Math.round(1000 * price) / 1000
}

updatePriceLabel = (label, price) => {
  label.innerText = '$' + price
}

getHistory = data => {
  let timestamps = data.map(item => item.timestamp)
  let dates = timestamps.map(ts => (new Date(ts * 1000))).map(date => date.toDateString())
  let uniqueDates = [...new Set(dates)]

  let history = {}
  uniqueDates.forEach(date => {
    history[date] = data.filter(item =>
      new Date(item.timestamp * 1000).toDateString() === date)
  })

  return history
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
