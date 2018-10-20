
import React from 'react'
import PropTypes from 'prop-types'
import AboutDlg from 'Dialogs/AboutDlg'
import ServiceManager from 'SvcManager'
import './AppNavbar.scss'

import { encodeQuery } from "../../utils";

import {
  DropdownButton,
  NavDropdown,
  MenuItem,
  Navbar,
  Button,
  Modal,
  Nav
  } from 'react-bootstrap'

export default class AppNavbar extends React.Component {

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  constructor (props) {

    super(props)

    this.state = {
      aboutOpen:    false
    }

    this.forgeSvc = ServiceManager.getService('ForgeSvc')
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  openAboutDlg () {

    this.setState(Object.assign({}, this.state, {
      aboutOpen: true
    }))
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  login () {

    const { appState } = this.props

    if (appState.user) {

      this.props.setUser(null)

      this.forgeSvc.logout()

    } else {

      this.forgeSvc.login()
    }
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  render() {

    const { appState } = this.props

    const {user} = appState

    const username = user
      ? `${user.firstName} ${user.lastName}`
      : ''

    return (
      <nav className="navbar">
        <div className="nav-left">

          <NavItem 
            icon="home.png" 
            pathname="/" 
            router={this.props.router} />

          <NavItem 
            name="Projects" 
            pathname="/project"
            router={this.props.router} />

          <NavItem 
            name="Estimate" 
            pathname='/estimate' 
            query={{
              path: 'resources/models/arca/3D View/arca/arca.svf',
              extIds: 'Viewing.Extension.Event'
            }}
            router={this.props.router}
             />
          {/* ?path=resources%2Fmodels%2Farca%2F3D+View%2Farca%2Farca.svf&extIds=Viewing.Extension.Event */}
          {/* ?path=resources%2Fmodels%2Farca%2F3D%20View%2Farca%2Farca.svf&extIds=Viewing.Extension.Event */}
          
          
          <div className="nav-item-wrapper">
            <div className="nav-item">
              <input placeholder="Search..." type="text"/>
            </div> 
          </div>
        </div>
        
        <div className="nav-right">
          <NavItem name="Log in" /> 
        </div>
      </nav>
      // <Navbar className="custom-navbar">
      //   {/* <Navbar.Header>
      //     <Navbar.Brand>
      //       <NavItem className="forge-brand-item"
      //         href="http://hermosillo.com/"
      //         target="_blank">
      //         <img height="20" src="/resources/img/hermosillo.jpg"/>
      //       </NavItem>
      //     </Navbar.Brand>
      //     <Navbar.Toggle/>
      //   </Navbar.Header> */}

      //   <Navbar.Collapse>

      //     {
      //       appState.navbar.links.home &&

      //       <Nav>
      //         <LinkContainer to={{ pathname: '/', query: { } }}>
      //           <NavItem eventKey="home">
      //             <label className="nav-label">
      //               &nbsp; Home
      //             </label>
      //           </NavItem>
      //         </LinkContainer>
      //       </Nav>
      //     }

      //     {
      //       appState.navbar.links.estimate &&

      //       <Nav>
      //         <LinkContainer to={{
      //           pathname: '/estimate',
      //           query: {
      //             path: 'resources/models/arca/3D View/arca/arca.svf',
      //             extIds: 'Viewing.Extension.Event'
      //           }
      //         }}>
      //           <NavItem eventKey="estimate">
      //             <label className="nav-label">
      //               &nbsp; Estimate
      //             </label>
      //           </NavItem>
      //         </LinkContainer>
      //       </Nav>
      //     }

      //     <Nav pullRight>

      //       {

      //       appState.navbar.links.login &&

      //       <NavItem eventKey="login" onClick={() => {this.login()}}>
              
      //         {
      //           appState.user &&
      //           <img className="avatar" src={appState.user.profileImages.sizeX80}/>
      //         }
      //         <label className="nav-label">
      //           &nbsp; { appState.user ? username : "Login"}
      //         </label>
      //       </NavItem>
      //         }

      //       {
      //         appState.navbar.links.about &&

      //         <NavItem eventKey="about" onClick={() => {this.openAboutDlg()}}>
      //           <label className="nav-label">
      //             &nbsp; About
      //           </label>
      //         </NavItem>
      //       }
      //     </Nav>

      //   </Navbar.Collapse>

      //   <AboutDlg
      //     close={()=>{ this.setState(Object.assign({}, this.state, {
      //       aboutOpen: false
      //     }))}}
      //     open={this.state.aboutOpen}
      //   />

      // </Navbar>
    )
  }
}

const NavItem = (props) => {
  
  const {pathname, name, icon, router, modifier} = props;

  let {query} = props;
  
  const onClick = (e) => {

    if(query){
      query = encodeQuery(query)
      console.log(query);
    }

    router.push(`${pathname}${query ? `${query}` : ''}`)
  }

  return (
    
    <div 
      onClick={onClick} 
      className="nav-item-wrapper nav-item-button">
      
      <div className={`nav-item`}>
        {!!icon && <img width="20px" src={`/resources/img/${icon}`}/>}

        {!!name && name}
        </div> 
    </div>
  )
}
