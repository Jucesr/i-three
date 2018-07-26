import React from 'react'
import QuantityInput from './QuantityInput'
import RowActionsModal from './RowActionsModal'
import ReactTable from "react-table"
import ReactModal from 'react-modal';
// import { Form, Text } from 'informed'
import "react-table/react-table.css"

Number.prototype.format = function(n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~n));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};

class EstimateTable extends React.Component {

  constructor(props){
    super(props);
    this.header_height = 65
    this.state = {
      expanded: this.props.expanded,
      row_actions_modal: {
        visible: false,
        x: 0,
        y: 0,
        actions: []
      },
      showEditForm: false
    }
    this.actions = {
      add_item: (row) => this.generateAction('Add line item', () => {
        console.log('It will add a new row')
        console.log(row)
      }),
      add_header: (row) => this.generateAction('Add header', () => {
        console.log('It will add a header')
        console.log(row)
      }),
      add_sub_header: (row) => this.generateAction('Add sub header', () => {
        console.log('It will add a sub header ')
        console.log(row)
      }),
      delete_item: row => this.generateAction('Delete item', () => {
        this.props.deleteLineItem(row.rn)
      }),
      edit_item: row => this.generateAction('Edit item', () => {
        this.setState((prevState) => ({
          showEditForm: true
        }))
      }),
      quantify_item: row => this.generateAction('Quantify item', () => {
        let rn = row.rn;
        let quantity = this.props.selectedDbItem.properties.Volume
        this.props.updateQuantityOfItem({rn,quantity})
      })
    }

  }

  generateAction(title, action){
    return {
      title,
      onClick: () => {
        action()
        this.setState((prevState) => ({
          row_actions_modal: {
            visible: false
          }
        }))
      }
    }
  }

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

  // renderEditable(cellInfo) {
  //  if(!cellInfo.subRows){
  //    return (
  //        <QuantityInput
  //          quantityValue={cellInfo.original.quantity}
  //          onBlur={(quantity) => {
  //            let rn = cellInfo.original.rn
  //            this.props.updateQuantityOfItem({rn,quantity})
  //          }}
  //        />
  //
  //      );
  //    }
  //
  //  }

  onContextMenu(actions){
    return (e, handleOriginal) => {
      e.preventDefault();
      let xpos = e.pageX
      let ypos = e.pageY

      this.setState((prevState) => ({
        row_actions_modal: {
          visible: true,
          x: xpos,
          y: ypos - this.header_height,
          actions: actions
        }
      }))

      if (handleOriginal) {
        handleOriginal()
      }
    }
  }

  getTrProps(state, rowInfo, column){
   let events = {}

   let {add_item, add_header, add_sub_header, delete_item, edit_item, quantify_item} = this.actions
   if(rowInfo ){
     let row
     let color
     let actions = []
     let className
     switch (rowInfo.row._pivotID) {
       case "lv01":
         color = 'rgb(205,205,205)'
       break;
       case "lv02":
         row = rowInfo.row._subRows[rowInfo.row._subRows.length - 1]
         color = 'rgb(225,225,225)'
         actions = [
           [add_item(row), add_header(row), add_sub_header(row)]
         ]
       break;
       default:
         //Line items
         row = rowInfo.original
         color = 'rgb(245,245,245)'
         className = 'test-hover'
         actions = [
           [add_item(row)],
           [edit_item(row), delete_item(row) , quantify_item(row)]
         ]

       break;
     }
     //All rows
     events = {
       className,
       onContextMenu: this.onContextMenu(actions),
       style: {
           background: color
       }
     }
   }

   return events
   }

  render(){

    return (
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
              Aggregated: row => false
              // Cell: this.renderEditable.bind(this)
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
        {
          this.state.row_actions_modal.visible &&

          <RowActionsModal
            x={this.state.row_actions_modal.x}
            y={this.state.row_actions_modal.y}
            makeInvisible={() => this.setState((prevState) => ({
                row_actions_modal: {
                  visible: false
                }
              }))
            }
           actions={this.state.row_actions_modal.actions}

          />
        }

        <ReactModal
           isOpen={this.state.showEditForm}
           contentLabel="Minimal Modal Example"
        >
          <button onClick={this.handleCloseModal}>Close Modal</button>
        </ReactModal>


      </div>
    )
  }
}

export default EstimateTable
