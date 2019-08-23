import React from 'react'
import { shallow } from 'enzyme'
import { Icon } from 'pass-culture-shared'
import { NavLink } from 'react-router-dom'
import VenueProviderItem from '../VenueProviderItem'

describe('src | components | pages | Venue | VenueProvidersManager | VenueProviderItem', () => {
  let props

  beforeEach(() => {
    props = {
      venueProvider: {
        id: 1,
        isActive: true,
        lastSyncDate: '2018-01-01',
        nOffers: 1,
        provider: {
          name: 'fake local class',
          localClass: 'OpenAgendaEvents',
        },
        venueId: 1,
        venueIdAtOfferProvider: 'fake id',
      },
    }
  })

  it('should match the snapshot', () => {
    // when
    const wrapper = shallow(<VenueProviderItem {...props} />)

    // then
    expect(wrapper).toMatchSnapshot()
  })

  describe('render', () => {
    it('should contain an Icon component with the right props', () => {
      // when
      const wrapper = shallow(<VenueProviderItem {...props} />)

      // then
      const icon = wrapper.find(Icon).first()
      expect(icon).toHaveLength(1)
      expect(icon.prop('svg')).toBe('logo-openAgenda')
    })

    it('should render provider local class when provided', () => {
      // when
      const wrapper = shallow(<VenueProviderItem {...props} />)

      // then
      const providerLocalClass = wrapper.find('.provider-name-container')
      expect(providerLocalClass.text()).toBe('fake local class')
    })

    it('should display import message when venue provider is not synced yet', () => {
      // given
      props.venueProvider.lastSyncDate = null

      // when
      const wrapper = shallow(<VenueProviderItem {...props} />)

      // then
      const importMessageContainer = wrapper.find('.import-label-container')
      expect(importMessageContainer).toHaveLength(1)
      expect(importMessageContainer.text()).toBe(
        'Importation en cours. Cette étape peut durer plusieurs dizaines de minutes.'
      )
    })

    it('should render venue id at offer provider when provided', () => {
      // when
      const wrapper = shallow(<VenueProviderItem {...props} />)

      // then
      const venueIdAtOfferProvider = wrapper.find('strong.has-text-weight-bold')
      expect(venueIdAtOfferProvider.text()).toBe('fake id')
    })

    it('should render the number of offers when data of provider were already synced and offers are provided', () => {
      // when
      const wrapper = shallow(<VenueProviderItem {...props} />)

      // then
      const navLink = wrapper.find(NavLink)
      expect(navLink.prop('to')).toBe('/offres?lieu=1')
      expect(navLink.prop('className')).toBe('has-text-primary')
      const icon = navLink.find(Icon)
      expect(icon.prop('svg')).toBe('ico-offres-r')
      const numberOfOffersLabel = navLink.find('.number-of-offers-label')
      expect(numberOfOffersLabel).toHaveLength(1)
      expect(numberOfOffersLabel.text()).toBe('1 offre')
    })

    it('should render zero offers label when data of provider were already synced and no offers', () => {
      // given
      props.venueProvider.nOffers = 0

      // when
      const wrapper = shallow(<VenueProviderItem {...props} />)

      // then
      const numberOfOffersLabel = wrapper.find('.offers-container .number-of-offers-label')
      expect(numberOfOffersLabel).toHaveLength(1)
      expect(numberOfOffersLabel.text()).toBe('0 offre')
    })
  })
})