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
      this.resetMenuItems()
      document.getElementById('menuMain').className = 'menuItem selected'
    }

    Array.from(document.getElementsByClassName('menuItem')).forEach(menuItem => {
      if (menuItem.id.includes('Outlet')) {
        menuItem.onclick = () => {
          this.setState({
            view: parseInt(menuItem.id[menuItem.id.length - 1])
          })
          this.resetMenuItems()
          menuItem.className = 'menuItem selected'
        }
      }
    })
  }

  resetMenuItems = () => {
    Array.from(document.getElementsByClassName('menuItem')).forEach(menuItem => {
      menuItem.className = 'menuItem'
    })
  }

  render() {
    if (this.state.view === 'main') {
      return (
        <OutletSummary />
      )
    } else {
      return (
        <Outlet outlet={this.state.view} key={this.state.view} />
      )
    }
  }
}

ReactDOM.render(<CurrentView />, document.querySelector('#view'))
