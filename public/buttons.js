class PowerButton extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    if (this.props.power === 'on') {
      return (
        <div>
          <div className="badgeDiv"><span className="badge onBadge">On</span></div>
          <div><button type="button" className="btn offButton"
                        onClick={this.props.onClick}>Turn Off</button></div>
        </div>
      )
    } else {
      return (
        <div>
          <div className="badgeDiv"><span className="badge offBadge">Off</span></div>
          <div><button type="button" className="btn onButton"
                        onClick={this.props.onClick}>Turn On</button></div>
        </div>
      )
    }
  }
}
