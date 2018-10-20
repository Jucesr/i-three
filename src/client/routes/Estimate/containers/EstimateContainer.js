import { connect } from 'react-redux'

import {setViewerEnv} from '../../../store/app'
import {
  onDbItemSelected,
  updateQuantityOfItem,
  saveExpanded,
  addLineItem,
  saveLineItem,
  deleteLineItem
} from '../modules/estimate'

import EstimateView from '../components/EstimateView'


const mapDispatchToProps = {
  setViewerEnv,
  onDbItemSelected,
  updateQuantityOfItem,
  saveExpanded,
  addLineItem,
  saveLineItem,
  deleteLineItem
}

const mapStateToProps = (state) => ({
  ...state.estimate,
  project: state.project,
  appState: state.app
})


export default connect(
  mapStateToProps,
  mapDispatchToProps, null, {
    pure: false
  })(EstimateView)
