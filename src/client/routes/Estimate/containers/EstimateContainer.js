import { connect } from 'react-redux'

import {setViewerEnv} from '../../../store/app'
import {
  onDbItemSelected,
  updateQuantityOfItem,
  saveExpanded,
  addLineItem,
  deleteLineItem
} from '../modules/estimate'

import EstimateView from '../components/EstimateView'


const mapDispatchToProps = {
  setViewerEnv,
  onDbItemSelected,
  updateQuantityOfItem,
  saveExpanded,
  addLineItem,
  deleteLineItem
}

const mapStateToProps = (state) => ({
  ...state.estimate,
  appState: state.app
})


export default connect(
  mapStateToProps,
  mapDispatchToProps, null, {
    pure: false
  })(EstimateView)
