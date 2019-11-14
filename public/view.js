class CurrentView extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      view: 'main'
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
