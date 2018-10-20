import { injectReducer } from '../../store/reducers'

export default (store) => ({

  path : 'project',

  getComponent (nextState, cb) {

    require.ensure([], (require) => {

      const container = require('./containers/').default
      const reducer = require('./modules/project').default

      injectReducer(store, { key: 'project', reducer })

      cb(null, container)

    }, 'project')
  },

  childRoutes: [{
    path: 'estimate',
    getComponent(nextState, cb) {

      require.ensure([], (require) => {
  
        const container = require('./containers/').default
        // const reducer = require('./modules/estimate').default
        const reducer = undefined;
  
        injectReducer(store, { key: 'project', reducer })
  
        cb(null, container)
  
      }, 'estimate')
    },
  }
  ]
})
