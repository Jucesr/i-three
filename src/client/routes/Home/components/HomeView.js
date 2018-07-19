import { IndexLink, Link } from 'react-router'
import React from 'react'
import './HomeView.scss'

class HomeView extends React.Component {

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  constructor(props) {

    super(props)

    this.state = {
      models: props.models
    }
  }

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  render() {

    return (
      <div className="home">
        <img className='logo-hero'/>
        <div className="models">
          <div className="title">
            Choose Model
          </div>
          <div className="content responsive-grid">
            {
              this.state.models.map((model, idx) => {

                let query = `path=${model.path}`

                if (model.extensions) {

                  query += '&extIds=' + model.extensions.join(';')
                }

                return (
                  <Link key={idx} to={`/viewer?${query}`}>
                    <figure>
                      <figcaption>
                        {model.name}
                      </figcaption>
                      <img className={model.thumbnailClass || 'default-thumbnail'}
                        src={model.thumbnail || ''}/>
                    </figure>
                  </Link>)
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

export default HomeView
