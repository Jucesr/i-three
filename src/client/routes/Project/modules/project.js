// ------------------------------------
// Constants
// ------------------------------------

// ------------------------------------
// Actions
// ------------------------------------
export const addProject = (project) => ({
  type    : "ADD_PROJECT",
  payload : project
})

export const selectProject = (id) => ({
  type    : "SELECT_PROJECT",
  payload : id
})


// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  "ADD_PROJECT": (state, action) => {
    return {
      ...state,
      items: {
        ...items,
        [action.payload.id]: {
          ...action.payload
        }
      }
    }
  },

  "SELECT_PROJECT": (state, action) => {
    return{
      ...state,
      active: action.payload
    }
  }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  items: {
    1: {
      id: 1,
      name: "Calzada",
      uen: "Mexicali",
      picture: "calzada.jpg",
      progress: 25
    },
    2: {
      id: 2,
      name: "Punta Este",
      uen: "Mexicali",
      picture: "punta_este.jpg",
      progress: 90
    },
    3: {
      id: 3,
      name: "Calafia",
      uen: "Mexicali",
      picture: "calafia.jpg",
      progress: 59
    }
  },
  active: undefined
}

export default function reducer (state = initialState, action) {

  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
