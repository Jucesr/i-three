import { IndexLink, Link } from 'react-router'
import React from 'react'
import './HomeView.scss'

class HomeView extends React.Component {

  /////////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////////
  constructor() {

    super()

    this.state = {
      models: [
        {
          path: 'resources/models/seat/seat.svf',
          thumbnailClass: 'seat-thumbnail',
          name: 'Seat'
        },
        {
          extensions: ['Viewing.Extension.Event'],
          path: 'resources/models/bb8/Storyboard1.svf',
          thumbnailClass: 'bb8-thumbnail',
          name: 'BB8'
        },
        {
          extensions: ['Viewing.Extension.Event'],
          path: 'resources/models/arca/3D View/arca/arca.svf',
          thumbnailClass: 'arca-thumbnail',
          name: 'Arca'
        }
      ]
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
