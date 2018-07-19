import { connect } from 'react-redux'

import HomeView from '../components/HomeView'

const mapDispatchToProps = {

}

const mapStateToProps = (state) => {

  return {
    models: state.home.models
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps)(HomeView)
