// ------------------------------------
// Constants
// ------------------------------------
export const ON_DB_ITEM_SELECTED = 'ON_DB_ITEM_SELECTED'
export const UPDATE_QUANTITY_OF_ITEM_SELECTED = 'UPDATE_QUANTITY_OF_ITEM_SELECTED'
export const LOAD_DB_ITEMS = 'LOAD_DB_ITEMS'
export const SAVE_EXPANDED = 'SAVE_EXPANDED'
export const ADD_LINE_ITEM = 'ADD_LINE_ITEM'
export const DELETE_LINE_ITEM = 'DELETE_LINE_ITEM'

// ------------------------------------
// Actions
// ------------------------------------
export const loadDbItems = (dbItems) => {
  return {
    type    : LOAD_DB_ITEMS,
    payload : dbItems
  }
}

export const onDbItemSelected = (dbItem) => {
  return {
    type    : ON_DB_ITEM_SELECTED,
    payload : dbItem
  }
}

export const updateQuantityOfItem = (item) => {
  return {
    type    : UPDATE_QUANTITY_OF_ITEM_SELECTED,
    payload : item
  }
}

export const saveExpanded = (expanded) => ({
    type    : SAVE_EXPANDED,
    payload : expanded
})

export const addLineItem = (item) => ({
    type    : ADD_LINE_ITEM,
    payload : item
})

export const deleteLineItem = (rn) => ({
    type    : DELETE_LINE_ITEM,
    payload : rn
})

export const actions = {
  onDbItemSelected,
  loadDbItems,
  updateQuantityOfItem,
  saveExpanded,
  addLineItem,
  deleteLineItem
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {

  [LOAD_DB_ITEMS] : (state, action) => {

    const dbItems = _.sortBy(action.payload,
      (dbItem) => {
        return dbItem.name
      })

    return Object.assign({}, state, {
      dbItems
    })
  },

  [ON_DB_ITEM_SELECTED] : (state, action) => {
    return Object.assign({}, state, {
      selectedDbItem: action.payload
    })
  },

  [UPDATE_QUANTITY_OF_ITEM_SELECTED] : (state, action) => {
    return {
      ...state,
      estimate_data: state.estimate_data.map(item => {
        if(item.rn == action.payload.rn){
          item.quantity = action.payload.quantity
          item.total = item.quantity * item.pu
        }

        return item
      })
    }
  },

  [SAVE_EXPANDED] : (state, action) => {
    return {
      ...state,
      expanded: action.payload
    }
  },

  [ADD_LINE_ITEM] : (state, action) => {
    return {
      ...state,
      estimate_data: state.estimate_data.concat(action.payload)
    }
  },

  [DELETE_LINE_ITEM] : (state, action) => {
    return {
      ...state,
      estimate_data: state.estimate_data.filter(item => item.rn != action.payload)
    }
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
var new_items = []
for (var i = 0; i < 30; i++) {
  new_items.push({
      rn: `01.${i+2}`,
      lv01: '01',
      lv01_description: 'Requerimientos generales',
      description: 'dummy',
      pu: 1500.00,
      quantity: 2,
      total: 3000.00
  })

  new_items.push({
    rn: `03.02.${i+3}`,
    lv01: '03',
    lv01_description: 'Concretos',
    lv02: '02',
    lv02_description: 'Cimentaciones',
    description: 'Dummy',
    pu: 109.82,
    quantity: 200.45,
    total: 22012.74
  })

  new_items.push({
    rn: `03.03.${i+2}`,
    lv01: '03',
    lv01_description: 'Concretos',
    lv02: '03',
    lv02_description: 'Cimentaciones',
    description: 'Dummy',
    pu: 109.82,
    quantity: 200.45,
    total: 22012.74
  })
}


const initialState = {
  dbItems: [],
  expanded: {},
  estimate_data: [{
    rn: '01.01',
    lv01: '01',
    lv01_description: 'Requerimientos generales',
    description: 'Diseno',
    pu: 1000.00,
    quantity: 20.00,
    total: 1000.00
  },{
    rn: '01.02',
    lv01: '01',
    lv01_description: 'Requerimientos generales',
    description: 'Licencias',
    pu: 1500.00,
    quantity: 2,
    total: 3000.00
  },{
    rn: '03.02.01',
    lv01: '03',
    lv01_description: 'Concretos',
    lv02: '02',
    lv02_description: 'Cimentaciones',
    description: 'Excavacion a maquina',
    pu: 109.82,
    quantity: 200.45,
    total: 22012.74
  },{
    rn: '03.02.02',
    lv01: '03',
    lv01_description: 'Concretos',
    lv02: '02',
    lv02_description: 'Cimentaciones',
    description: 'Afine manual',
    pu: 40.54,
    quantity: 713.71,
    total: 28933.80
  },{
    rn: '03.03.01',
    lv01: '03',
    lv01_description: 'Concretos',
    lv02: '03',
    lv02_description: 'Firmes',
    description: 'Plantilla de concreto',
    pu: 129.16,
    quantity: 200.4,
    total: 25888.49
  }, ...new_items ]
}

export default function reducer (state = initialState, action) {

  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
