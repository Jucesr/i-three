import ServiceManager from 'SvcManager'
import 'Dialogs/dialogs.scss'
import Header from 'Header'
// import 'forge-white.scss'
import 'core.scss'
import React from 'react'


class CoreLayout extends React.Component {

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  static propTypes = {
    children : React.PropTypes.element.isRequired
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  componentWillMount () {

    this.forgeSvc =
      ServiceManager.getService(
        'ForgeSvc')

    this.forgeSvc.getUser().then((user) => {

      this.props.setUser(user)

    }, () => {

      this.props.setUser(null)
    })
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  render () {

    const { children } = this.props

    return (
      <div className='container text-center'>
        <Header {...this.props}/>
        <div className='core-layout'>
          {children}
        </div>
      </div>
    )
  }
}

export default CoreLayout
