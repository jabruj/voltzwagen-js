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
    })
    // this.state.interval = setInterval(() => {
    //   fetchData().then(res => {
    //     updateCharts(charts, res[this.state.outlet])
    //   })
    // }, intervalDelay * 1000)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    drawCharts(this.state.outlet)
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
        <canvas id={'kWhChart' + i}></canvas>
        <canvas id={'priceChart' + i}></canvas>
        <canvas id={'historyChart' + i}></canvas>
        <canvas id={'costHistoryChart' + i}></canvas>
      </div>
    )
  }
}
