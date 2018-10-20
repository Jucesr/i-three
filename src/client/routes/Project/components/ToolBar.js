import React from 'react'
import './ToolBar.scss'


export default (props) => {

  const {isOpen = true} = props

  const toolBarClass = `ToolBar ${isOpen ? 'ToolBar_open' : 'ToolBar_close'}`;

  return (
    <div className={toolBarClass}>
        <div className="ToolBar-container">
          <ToolBarItem name="Estimates" />
          <ToolBarItem name="Line Items" />
          <ToolBarItem name="Materials" />
          <ToolBarItem name="WBS" />
          <ToolBarItem name="Packages" />
          <ToolBarItem name="Gallery" />
          <ToolBarItem name="Change orders" />
          <ToolBarItem name="Issues" />
          <ToolBarItem name="Construction Systems" />
        </div>
      </div>
  )
}

const ToolBarItem = (props) => {
  return (
    <div 
      className="ToolBar-item"
      onClick={props.onClick}
    > 
      <div>
        {props.name} 
      </div>
  
    </div>
  )
}