import React from 'react'
import './SubHeader.scss'

export default class SubHeader extends React.Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  render(){
    const {
      projectName,
      onClickMenuHandler
    } = this.props
    return (
      <div className="SubHeader-wrapper">
        <div className="SubHeader">
          <div onClick={onClickMenuHandler}>
            <img width="30px" src="/resources/img/menu.png"></img>
          </div>
          <div className="SubHeader-project">
            <strong>{projectName}</strong>
          </div>

          <div className="SubHeader-estimate">
            Revisión 01, Oct 18
          </div>
        </div>
      </div>
    )
  }
}