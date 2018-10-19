import React from 'react'
import './SubHeader.scss'

export default class SubHeader extends React.Component {

  constructor(props){
    super(props)
    this.state = {}
  }

  render(){
    const {props} = this
    return (
      <div className="SubHeader-wrapper">
        <div className="SubHeader">
          <div onClick={props.onClickMenuHandler}>
            <img width="30px" src="/resources/img/menu.png"></img>
          </div>
          <div className="SubHeader-project">
            <strong>Calzada</strong>
          </div>

          <div className="SubHeader-estimate">
            Revisión 01, Oct 18
          </div>
        </div>
      </div>
    )
  }
}