// ------------------------------------
// Constants
// ------------------------------------

// ------------------------------------
// Actions
// ------------------------------------

export const actions = {

}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {

}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
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

export default function reducer (state = initialState, action) {

  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
