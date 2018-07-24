// import Viewer from '../../../components/Viewer.Components/Viewer'
import Viewer from 'Viewer'
import QuantityInput from './QuantityInput'
import './EstimateView.scss'
import React from 'react'
import ReactTable from "react-table";
import "react-table/react-table.css";

Number.prototype.format = function(n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~n));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};

class EstimateView extends React.Component {

   /////////////////////////////////////////////////////////
   //
   //
   /////////////////////////////////////////////////////////
   constructor (props) {

      super (props)

      this.state = {
        expanded: this.props.expanded
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


      } catch (ex) {

        console.log('Viewer Initialization Error: ')
        console.log(ex)
      }
   }

   /////////////////////////////////////////////////////////
   //
   //
   /////////////////////////////////////////////////////////

   formatIndividualColumn(format){
      switch (format) {
        case 'currency':
          return row => {
              return !isNaN(row.value) ? (
                `$${parseFloat(row.value).format(2,3,',','.')}`
              ) : row.value
            }
        break;

        case 'number':
          return row => {
              return !isNaN(row.value) ? (
                `${parseFloat(row.value).format(2,3,',','.')}`
              ) : row.value
            }
        break;

        case 'text': {
          return row => row.value
        }
        default:

      }
    }

   renderEditable(cellInfo) {
    if(!cellInfo.subRows){
      return (
        // <div
        //   // style={{ backgroundColor: "#fafafa" }}
        //   contentEditable
        //   suppressContentEditableWarning
        //   onBlur={e => {
        //     let rn = cellInfo.original.rn
        //     let quantity = e.target.innerHTML
        //     if(quantity.length > 0 && !isNaN(quantity))
        //       this.props.updateQuantityOfItem({rn,quantity})
        //     else{
        //       this.props.updateQuantityOfItem({
        //         rn,
        //         quantity: cellInfo.original.quantity
        //       })
        //     }
        //     // const data = [...this.state.data];
        //     // data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
        //     // this.setState({ data });
        //   }}
        //   dangerouslySetInnerHTML={{
        //     __html:  `${parseFloat(cellInfo.original.quantity).format(2,3,',','.')}`
        //   }}
        // />
        // <input
        //   type='text'
        //   defaultValue={cellInfo.original.quantity}
        //   onChange={e => {
        //     if (e.target.value.match(/^\d*(\.\d{0,2})?$/)) {
        //       this.setState(() => ({ amount }));
        //     }
        //   }}
        //   onBlur={e => {
        //     let rn = cellInfo.original.rn
        //     let quantity = e.target.value
        //     if(quantity.length > 0 && !isNaN(quantity))
        //       this.props.updateQuantityOfItem({rn,quantity})
        //     else{
        //       this.props.updateQuantityOfItem({
        //         rn,
        //         quantity: cellInfo.original.quantity
        //       })
        //     }
        //   }}
        // />
        <QuantityInput
          quantityValue={cellInfo.original.quantity}
          onBlur={(quantity) => {
            let rn = cellInfo.original.rn
            this.props.updateQuantityOfItem({rn,quantity})
          }}
        />

      );
    }

  }

   getTrProps(state, rowInfo, column){
    let events = {}

    if(rowInfo ){
      let lv01 = 'rgb(205,205,205)'
      let lv02 = 'rgb(225,225,225)'
      let lineItem = 'rgb(245,245,245)'
      let color
      switch (rowInfo.row._pivotID) {
        case "lv01":
          color = lv01
        break;
        case "lv02":
          color = lv02
        break;
        default:
          color = lineItem
          events = {
            className: 'test-hover',
            // onClick: (e, handleOriginal) => {
            //     let rn = rowInfo.row.rn;
            //     let quantity = this.props.selectedDbItem.properties.Volume
            //     this.props.updateQuantityOfItem({rn,quantity})
            //   if (handleOriginal) {
            //     handleOriginal();
            //   }
            // }
          }
        break;


      }
      events = {
        ...events,
        style: {
            background: color
        }
      }
    }

    return events
  }

   render () {


      return (
        <div className="viewer-view">
          <div className="estimate-table">
            <ReactTable
              data={this.props.estimate_data}
              pivotBy={['lv01', 'lv02']}
              columns={[
                {
                  Header: '',
                  accessor: 'lv01',
                  width: 30,
                  resizable: false,
                  PivotValue: () => (<div></div>),
                  pivot: true
                },{
                  Header: '',
                  accessor: 'lv02',
                  width: 30,
                  resizable: false,
                  Aggregated: row => false,
                  PivotValue: () => (<div></div>)
                },{
                  Header: 'RN',
                  accessor: 'rn',
                  Aggregated: row => {
                    let arrayOfLevels = ['lv01', 'lv02']
                    let level = arrayOfLevels.filter(lv => row.row[lv])[0]
                    let rn;
                    switch (level) {
                      case "lv01":
                        rn = row.subRows[0]._subRows[0]._original.lv01
                      break;
                      case "lv02":
                        rn = row.subRows[0]._original.lv02 ?
                          `${row.subRows[0]._original.lv01}.${row.subRows[0]._original.lv02}`
                          :
                          ''
                      break;

                    }
                    return (
                      <span>
                        {rn}
                      </span>
                    );
                  }
                },{
                  Header: 'Description',
                  accessor: 'description',
                  Aggregated: row => {
                    let arrayOfLevels = ['lv01', 'lv02']
                    let level = arrayOfLevels.filter(lv => row.row[lv])[0]
                    let description;
                    switch (level) {
                      case "lv01":
                        description = row.subRows[0]._subRows[0]._original.lv01_description
                      break;
                      case "lv02":
                        description = row.subRows[0]._original.lv02_description
                      break;

                    }
                    return (
                      <span>
                        {description}
                      </span>
                    );
                  }
                },{
                  Header: 'Unit price',
                  accessor: 'pu',
                  Aggregated: row => false,
                  Cell: this.formatIndividualColumn('currency')
                },{
                  Header: 'Quantity',
                  accessor: 'quantity',
                  Aggregated: row => false,
                  Cell: this.renderEditable.bind(this)
                },{
                  Header: 'Total',
                  accessor: 'total',
                  aggregate: vals => _.sum(vals),
                  Cell: this.formatIndividualColumn('currency')
                }
              ]}
              className="-striped -highlight"
              getTrProps={this.getTrProps.bind(this)}
              onExpandedChange={expanded => {
                this.props.saveExpanded(expanded)
                this.setState({ expanded })
              }}
              expanded={this.state.expanded}

            />
          </div>
          <Viewer onViewerCreated={(viewer => {
              this.onViewerCreated(viewer)
            })}
          />
        </div>
      )
   }
}

export default EstimateView
