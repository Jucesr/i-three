import uid from 'uid'

// ------------------------------------
// Constants
// ------------------------------------
export const ON_DB_ITEM_SELECTED = 'ON_DB_ITEM_SELECTED'
export const UPDATE_QUANTITY_OF_ITEM_SELECTED = 'UPDATE_QUANTITY_OF_ITEM_SELECTED'
export const LOAD_DB_ITEMS = 'LOAD_DB_ITEMS'
export const SAVE_EXPANDED = 'SAVE_EXPANDED'
export const ADD_LINE_ITEM = 'ADD_LINE_ITEM'
export const SAVE_LINE_ITEM = 'SAVE_LINE_ITEM'
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

export const saveLineItem = (item) => ({
    type    : SAVE_LINE_ITEM,
    payload : item
})

export const deleteLineItem = (_id) => ({
    type    : DELETE_LINE_ITEM,
    payload : _id
})

export const actions = {
  onDbItemSelected,
  loadDbItems,
  updateQuantityOfItem,
  saveExpanded,
  addLineItem,
  saveLineItem,
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
        if(item._id == action.payload._id){
          item.quantity = action.payload.quantity
          item.total = item.quantity * item.unit_price
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
      estimate_data: state.estimate_data.concat({
        ...action.payload,
        _id: uid()
      })
    }
  },

  [SAVE_LINE_ITEM]: (state, action) => {
    return {
      ...state,
      estimate_data: state.estimate_data.map(item => {
        if(item._id == action.payload._id)
          return action.payload
        return item
      })
    }
  },

  [DELETE_LINE_ITEM] : (state, action) => {
    return {
      ...state,
      estimate_data: state.estimate_data.filter(item => item._id != action.payload)
    }
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
var new_items = []
for (var i = 0; i < 1; i++) {
  new_items.push({
      _id: `00${i+6}`,
      reference_number: `01.0${i+2}`,
      level_1: '01',
      level_1_description: 'Requerimientos generales',
      description: 'dummy',
      unit_price: 1500.00,
      quantity: 2,
      total: 3000.00
  })

  new_items.push({
    _id: `0${i+6}0`,
    reference_number: `03.02.0${i+3}`,
    level_1: '03',
    level_1_description: 'Concretos',
    level_2: '02',
    level_2_description: 'Cimentaciones',
    description: 'Dummy',
    unit_price: 109.82,
    quantity: 200.45,
    total: 22012.74
  })

  new_items.push({
    _id: `${i+6}00`,
    reference_number: `03.03.0${i+2}`,
    level_1: '03',
    level_1_description: 'Concretos',
    level_2: '03',
    level_2_description: 'Cimentaciones',
    description: 'Dummy',
    unit_price: 109.82,
    quantity: 200.45,
    total: 22012.74
  })
}


const initialState = {
  dbItems: [],
  expanded: {},
  estimate_data: [{
      _id: '001',
      reference_number: '01.01',
      level_1: '01',
      level_1_description: 'Requerimientos generales',
      description: 'Diseno',
      unit_price: 1000.00,
      quantity: 20.00,
      total: 1000.00
    },{
      _id: '002',
      reference_number: '01.02',
      level_1: '01',
      level_1_description: 'Requerimientos generales',
      description: 'Licencias',
      unit_price: 1500.00,
      quantity: 2,
      total: 3000.00
    },{
      _id: '003',
      reference_number: '03.02.01',
      level_1: '03',
      level_1_description: 'Concretos',
      level_2: '02',
      level_2_description: 'Cimentaciones',
      description: 'Excavacion a maquina',
      unit_price: 109.82,
      quantity: 200.45,
      total: 22012.74
    },{
      _id: '004',
      reference_number: '03.02.02',
      level_1: '03',
      level_1_description: 'Concretos',
      level_2: '02',
      level_2_description: 'Cimentaciones',
      description: 'Afine manual',
      unit_price: 40.54,
      quantity: 713.71,
      total: 28933.80
    },{
      _id: '005',
      reference_number: '03.03.01',
      level_1: '03',
      level_1_description: 'Concretos',
      level_2: '03',
      level_2_description: 'Firmes',
      description: 'Plantilla de concreto',
      unit_price: 129.16,
      quantity: 200.4,
      total: 25888.49
    }, ...new_items
  ]
}

export default function reducer (state = initialState, action) {

  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
