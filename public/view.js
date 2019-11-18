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
      document.getElementById('menuMain').className = 'menuItem selected'
      document.getElementById('menuOutlet1').className = 'menuItem'
      document.getElementById('menuOutlet2').className = 'menuItem'
    }
    document.querySelector('#menuOutlet1').onclick = () => {
      this.setState({
        view: 'outlet1'
      })
      document.getElementById('menuMain').className = 'menuItem'
      document.getElementById('menuOutlet1').className = 'menuItem selected'
      document.getElementById('menuOutlet2').className = 'menuItem'
    }
    document.querySelector('#menuOutlet2').onclick = () => {
      this.setState({
        view: 'outlet2'
      })
      document.getElementById('menuMain').className = 'menuItem'
      document.getElementById('menuOutlet1').className = 'menuItem'
      document.getElementById('menuOutlet2').className = 'menuItem selected'
    }
  }

  render() {
    if (this.state.view === 'outlet1') {
      return (
        <Outlet outlet='1' key='1' />
      )
    } else if (this.state.view === 'outlet2') {
      return (
        <Outlet outlet='2' key='2' />
      )
    } else {
      return (
        <OutletSummary />
      )
    }
  }
}

ReactDOM.render(<CurrentView />, document.querySelector('#view'))
