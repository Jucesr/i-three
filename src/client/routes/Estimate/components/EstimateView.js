// import Viewer from '../../../components/Viewer.Components/Viewer'
import React from 'react'

import Viewer from 'Viewer'
import EstimateTable from './EstimateTable'

import './EstimateView.scss'

class EstimateView extends React.Component {

   /////////////////////////////////////////////////////////
   //
   //
   /////////////////////////////////////////////////////////
   constructor (props) {
      super (props)

      this.state = {
        show_model: false,
        viewer: null
      }
   }

   /////////////////////////////////////////////////////////
   // Initialize Estimate environment
   //
   /////////////////////////////////////////////////////////
   initialize (options) {

      return new Promise((resolve, reject) => {

        Autodesk.Viewing.Initializer (options, () => {

          resolve ()

        }, (error) => {

          reject (error)
        })
      })
   }

   /////////////////////////////////////////////////////////
   // Load a document from URN
   //
   /////////////////////////////////////////////////////////
   loadDocument (urn) {

      return new Promise((resolve, reject) => {

        const paramUrn = !urn.startsWith('urn:')
          ? 'urn:' + urn
          : urn

        Autodesk.Viewing.Document.load(paramUrn, (doc) => {

          resolve (doc)

        }, (error) => {

          reject (error)
        })
      })
   }

   /////////////////////////////////////////////////////////
   // Return viewable path: first 3d or 2d item by default
   //
   /////////////////////////////////////////////////////////
   getViewablePath (doc, pathIdx = 0, roles = ['3d', '2d']) {

      const rootItem = doc.getRootItem()

      const roleArray = [...roles]

      let items = []

      roleArray.forEach((role) => {

        items = [ ...items,
          ...Autodesk.Viewing.Document.getSubItemsWithProperties(
            rootItem, { type: 'geometry', role }, true) ]
      })

      if (!items.length || pathIdx > items.length) {

        return null
      }

      return doc.getViewablePath(items[pathIdx])
   }

   /////////////////////////////////////////////////////////
   // viewer div and component created
   //
   /////////////////////////////////////////////////////////
   async onViewerCreated (viewer) {

      try {

        let { id, extIds, urn, path, pathIdx } =
          this.props.location.query

        // check if env is initialized
        // initializer cannot be invoked more than once

        if (!this.props.appState.viewerEnv) {

          await this.initialize({
            env: 'AutodeskProduction',
            useConsolidation: true
          })

          this.props.setViewerEnv('AutodeskProduction')

          Autodesk.Viewing.endpoint.setEndpointAndApi(window.location.origin + '/lmv-proxy-2legged','modelDerivativeV2')

          Autodesk.Viewing.Private.memoryOptimizedSvfLoading = true

          //Autodesk.Viewing.Private.logger.setLevel(0)
        }

        if (id) {

          // load by database id lookup
          // !NOT IMPLEMENTED HERE
          // could be something like:
          // const dbModel = getDBModelBy(id)
          // urn = dbModel.urn

        } else if (urn) {

          console.log(urn);

          const doc = await this.loadDocument (urn)

          path = this.getViewablePath (doc, pathIdx || 0)

        } else if (!path) {

          const error = 'Invalid query parameter: use id OR urn OR path in url'

          throw new Error(error)
        }

        viewer.start()

        if (extIds) {

          const extensionIds = extIds.split(';')

          for (let extensionId of extensionIds) {

            viewer.loadDynamicExtension(extensionId, this.props)
          }
        }

        viewer.loadModel(path)

        this.setState((prevState) => ({
          viewer
        }))


      } catch (ex) {

        console.log('Viewer Initialization Error: ')
        console.log(ex)
      }
   }

   /////////////////////////////////////////////////////////
   //
   //
   /////////////////////////////////////////////////////////

   quantityTakeOffItem = () => {
     //
     let viewer = this.state.viewer
     let items = _.cloneDeep(this.props.selectedDbItems)
     let dbids = items.map(item => item.id)
     viewer.isolateById(dbids)
     viewer.clearSelection()
     this.props.onDbItemSelected(items)

   }

   render () {


      return (
        <div className="estimate_page">
          <div className="estimate_subpage_toolbar">
            <button
              className="toolbar_toggle"
              onClick={e => {
                this.setState((prevState) => ({
                  show_model: !prevState.show_model
                }))
              }}
            >
              {this.state.show_model ? 'Hide': 'Show'}
            </button>
          </div>
          <div id="estimate_subpage_table" className="estimate_subpage_table">
            <EstimateTable
              estimate_data={this.props.estimate_data}
              expanded={this.props.expanded}
              deleteLineItem={this.props.deleteLineItem}
              addLineItem={this.props.addLineItem}
              saveLineItem={this.props.saveLineItem}
              selectedDbItem={this.props.selectedDbItem}
              saveExpanded={this.props.saveExpanded}
              quantityTakeOffItem={this.quantityTakeOffItem}
            />
            {/* AGREGAR SUBVENTANA PARA CUANTIFICAR */}
          </div>
          {this.state.show_model && <div className="estimate_subpage_viewer">
            <Viewer onViewerCreated={(viewer => {
                this.onViewerCreated(viewer)
              })}
            />
          </div>}

        </div>
      )
   }
}

export default EstimateView
