class CurrentView extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      view: 'main'
    }

    document.querySelector('#menuMain').onclick = () => {
      this.setState({
        view: 'main'
      })
    }
    document.querySelector('#menuOutlet1').onclick = () => {
      this.setState({
        view: 'outlet1'
      })
    }
    document.querySelector('#menuOutlet2').onclick = () => {
      this.setState({
        view: 'outlet2'
      })
    }
  }

  render() {
    if (this.state.view === 'outlet1') {
      return (
        <div>
          Outlet1
        </div>
      )
    } else if (this.state.view === 'outlet2') {
      return (
        <div>
          Outlet2
        </div>
      )
    } else {
      return (
        <div>
          Main
        </div>
      )
    }
  }
}

ReactDOM.render(<CurrentView />, document.querySelector('#app'))
