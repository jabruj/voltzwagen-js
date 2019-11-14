class Outlet extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      outlet: this.props.outlet
    }
  }

  static getDerivedStateFromProps(props, state) {
    return {
      outlet: props.outlet
    }
  }

  render() {
    return <div>outlet {this.state.outlet}</div>;
  }
}
