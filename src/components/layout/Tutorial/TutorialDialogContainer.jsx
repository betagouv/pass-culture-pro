import { connect } from 'react-redux'

import TutorialDialog from 'components/layout/Tutorial/TutorialDialog'
import { setUsers } from 'store/reducers/data'
import { selectIsFeatureActive } from 'store/selectors/data/featuresSelectors'

const mapStateToProps = state => {
  return {
    currentUser: state.users.currentUser,
    isFeatureActive: selectIsFeatureActive(state, 'PRO_TUTO'),
  }
}

const mapDispatchToProps = dispatch => ({
  setUserHasSeenTuto: currentUser => {
    const updatedUser = { ...currentUser, hasSeenProTutorials: true }
    dispatch(setUsers([updatedUser]))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(TutorialDialog)
