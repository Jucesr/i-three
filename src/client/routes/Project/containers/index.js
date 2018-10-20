import React from 'react'
import { connect } from 'react-redux'

import { ProjectItem } from "../components/ProjectItem";

import "./index.scss";

import {
  addProject,
  selectProject
} from '../modules/project'

class ProjectPage extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      toolBarOpen: true
    }
  }

  onSelectProject(id){
    
    this.props.selectProject(id)
    //this.props.router.push('/estimate')
    
  }

  render(){
    const {
      project
    } = this.props

    const projectItems = project.items

    return (
      <div className="ProjectPage">

      {Object.keys(projectItems).map(key => {
        const item = projectItems[key]
        return (
          <ProjectItem
            onClick={() => this.onSelectProject(item.id)}
            key={item.id}
            id={item.id}
            name={item.name}
            uen={item.uen}
            picture={item.picture}
            progress={item.progress}
          />
        )
      
      })}
      
      </div>
    )
  }
}


const mapDispatchToProps = {
  addProject,
  selectProject
}


const mapStateToProps = (state) => ({
  project: state.project
})


export default connect(
  mapStateToProps,
  mapDispatchToProps, null, {
    pure: false
  })(ProjectPage)
