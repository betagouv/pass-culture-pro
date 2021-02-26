import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'

import { selectIsFeatureActive } from 'store/selectors/data/featuresSelectors'

import SignupValidation from './SignupValidation'

export function mapStateToProps(state) {
  return {
    currentUser: state.users.currentUser,
    isNewHomepageActive: selectIsFeatureActive(state, 'PRO_HOMEPAGE'),
  }
}

export default compose(withRouter, connect(mapStateToProps))(SignupValidation)
