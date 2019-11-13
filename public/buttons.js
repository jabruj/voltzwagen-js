
class PowerIndicator extends React.Component {
  constructor(props) {
    super(props)
    this.state = { power: 'On' }
  }
  render() {
    if (this.state.power === 'On') {
      return (
        <button type="button" className="btn onButton">On</button>
      )
    } else {
      return (
        <button type="button" className="btn offButton">Off</button>
      )
    }
  }
}

class PowerButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = { power: 'On' }
  }
  render() {
    if (this.state.power === 'On') {
      return (
        <button type="button" className="btn offButton">Turn Off</button>
      )
    } else {
      return (
        <button type="button" className="btn onButton">Turn On</button>
      )
    }
  }
}

ReactDOM.render(<PowerIndicator/>, document.querySelector('#powerIndicator1'))
ReactDOM.render(<PowerIndicator/>, document.querySelector('#powerIndicator2'))
ReactDOM.render(<PowerButton/>, document.querySelector('#powerButton1'))
ReactDOM.render(<PowerButton/>, document.querySelector('#powerButton2'))
