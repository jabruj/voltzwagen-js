class PowerButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      outlet: props.outlet,
      power: 'on'
    }
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
  }

  render() {
    if (this.state.power === 'on') {
      return (
        <div>
          <div className="badgeDiv"><span className="badge onBadge">On</span></div>
          <div><button type="button" className="btn offButton"
                        onClick={this.togglePower}>Turn Off</button></div>
        </div>
      )
    } else {
      return (
        <div>
          <div className="badgeDiv"><span className="badge offBadge">Off</span></div>
          <div><button type="button" className="btn onButton"
                        onClick={this.togglePower}>Turn On</button></div>
        </div>
      )
    }
  }
}

ReactDOM.render(<PowerButton outlet="1" />, document.querySelector('#powerButton1'))
ReactDOM.render(<PowerButton outlet="2" />, document.querySelector('#powerButton2'))
