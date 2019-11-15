class Outlet extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      outlet: props.outlet,
      power: 'on',
      interval: null
    }
  }

  static getDerivedStateFromProps(props, state) {
    return {
      outlet: props.outlet,
    }
  }

  componentDidMount() {
    drawCharts(this.state.outlet)
    this.state.interval = setInterval(() => {
      fetchData().then(res => {
        console.log(res[this.state.outlet])
        // updateChart(res)
      })
    }, intervalDelay * 1000)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    drawCharts(this.state.outlet)
  }

  componentWillUnmount() {
    clearInterval(this.state.interval)
  }

  togglePower = event => {
    if (this.state.power === 'on') {
      this.setState({
        power: 'off'
      })
    } else {
      this.setState({
        power: 'on'
      })
    }

    let command = this.state.power === 'on' ? '0' : '1'
    const query = '/?outlet=' + this.state.outlet + '&command=' + command
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
      </div>
    )
  }
}
