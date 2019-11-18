class Outlet extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      outlet: props.outlet,
      power: null,
      interval: null
    }
  }

  componentDidMount() {
    getOutletPowerStates().then(res => {
      this.setState({
        power: res[this.state.outlet]
      })
    })

    let charts = drawCharts(this.state.outlet)
    fetchData().then(res => {
      updateCharts(charts, res[this.state.outlet])
    }).then(() => {
      // this.state.interval = setInterval(() => {
      //   fetchData().then(res => {
      //     updateCharts(charts, res[this.state.outlet])
      //   })
      // }, intervalDelay * 1000)
    })
  }

  componentWillUnmount() {
    clearInterval(this.state.interval)
  }

  togglePower = event => {
    if (this.state.power === '1') {
      this.setState({
        power: '0'
      })
    } else {
      this.setState({
        power: '1'
      })
    }

    let command = this.state.power === '1' ? '0' : '1'
    let query = '/?outlet=' + this.state.outlet + '&command=' + command
    fetch(server + 'send-command' + query)
  }

  render() {
    const i = this.state.outlet
    return (
      <div className="outlet" id={'outlet' + i}>
        <div className="buttonGroup" id={'powerButton' + i}>
          <PowerButton outlet={i} power={this.state.power} onClick={this.togglePower} />
        </div>
        <canvas id={'powerChart' + i}></canvas>
        <div>
          <div className="doughnutLabel" id={'kWhLabel' + i}>Outlet {i} kWh</div>
          <canvas id={'kWhChart' + i} className="doughnutChart"></canvas>
        </div>
        <div>
          <div className="doughnutLabel" id={'priceLabel' + i}>Outlet {i} $$$</div>
          <canvas id={'priceChart' + i} className="doughnutChart"></canvas>
        </div>
        <canvas id={'historyChart' + i}></canvas>
        <canvas id={'costHistoryChart' + i}></canvas>
      </div>
    )
  }
}

////////////////////////////////////////
class OutletSummary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      outlet: props.outlet
    }
  }

  componentDidMount() {
    let charts = drawSummaryCharts(this.state.outlet)
    fetchData().then(res => {
      updateSummaryCharts(charts, res[this.state.outlet])
    })
  }

  render() {
    const i = this.state.outlet
    return (
      <div>
        <h3>Outlet {i}</h3>
        <canvas id={'historyChart' + i}></canvas>
        <canvas id={'costHistoryChart' + i}></canvas>
      </div>
    )
  }
}
