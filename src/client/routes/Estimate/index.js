import { injectReducer } from '../../store/reducers'

export default (store) => ({

  path : 'estimate',

  getComponent (nextState, cb) {

    require.ensure([], (require) => {

      const container = require('./containers/EstimateContainer').default
      const reducer = require('./modules/estimate').default

      injectReducer(store, { key: 'estimate', reducer })

      cb(null, container)

    }, 'estimate')
  }
})
