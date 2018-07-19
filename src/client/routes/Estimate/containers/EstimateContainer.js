import { connect } from 'react-redux'

import {setViewerEnv} from '../../../store/app'

import EstimateView from '../components/EstimateView'

const mapDispatchToProps = {
  setViewerEnv
}

const mapStateToProps = (state) => ({
  ...state.viewer,
  appState: state.app
})


export default connect(
  mapStateToProps,
  mapDispatchToProps, null, {
    pure: false
  })(EstimateView)
