class PowerButton extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.power === '1') {
      return (
        <div>
          <div className="badgeDiv"><span className="badge onBadge">On</span></div>
          <div><button type="button" className="btn offButton"
                        onClick={this.props.onClick}>Turn Off</button></div>
        </div>
      )
    } else if (this.props.power === '0') {
      return (
        <div>
          <div className="badgeDiv"><span className="badge offBadge">Off</span></div>
          <div><button type="button" className="btn onButton"
                        onClick={this.props.onClick}>Turn On</button></div>
        </div>
      )
    } else {
      return (
        <div>
          <div className="badgeDiv"><span className="badge hiddenBadge">o</span></div>
          <div><button type="button" className="btn hiddenButton">o</button></div>
        </div>
      )
    }
  }
}
