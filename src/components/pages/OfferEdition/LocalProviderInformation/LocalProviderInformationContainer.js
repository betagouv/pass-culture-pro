import { connect } from 'react-redux'
import { compose } from 'redux'

import LocalProviderInformation from './LocalProviderInformation'
import { getProviderInfo } from './getProviderInfo'
import withFrenchQueryRouter from '../../../hocs/withFrenchQueryRouter'
import { selectOfferById } from '../../../../selectors/data/offersSelectors'
import { selectProductById } from '../../../../selectors/data/productsSelectors'

export const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: { offerId },
    },
    isAllocine,
    isTitelive,
    offererId,
  } = ownProps

  const offer = selectOfferById(state, offerId)
  const product = selectProductById(state, offer.productId)
  const { venueId } = offer
  const { name: offerName } = offer
  const { thumbUrl } = product
  const providerInfo = getProviderInfo(isTitelive, isAllocine)

  return {
    offererId,
    offerName,
    providerInfo,
    thumbUrl,
    venueId,
  }
}

export default compose(
  withFrenchQueryRouter,
  connect(mapStateToProps)
)(LocalProviderInformation)