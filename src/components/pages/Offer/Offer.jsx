import get from 'lodash.get'
import PropTypes from 'prop-types'
import {
  Field,
  Form,
  Icon,
  mergeErrors,
  mergeForm,
  pluralize,
  resetForm,
  showModal,
  SubmitButton,
} from 'pass-culture-shared'

import React, { Component, Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import { requestData } from 'redux-saga-data'

import MediationsManager from './MediationsManager/MediationsManagerContainer'
import StocksManagerContainer from './StocksManager/StocksManagerContainer'
import HeroSection from '../../layout/HeroSection/HeroSection'
import Main from '../../layout/Main'
import { musicOptions, showOptions } from '../../../utils/edd'
import { offerNormalizer } from '../../../utils/normalizers'
import { getDurationInHours, getDurationInMinutes } from './utils/duration'

const DURATION_LIMIT_TIME = 100

const CONDITIONAL_FIELDS = {
  speaker: [
    'EventType.CONFERENCE_DEBAT_DEDICACE',
    'ThingType.PRATIQUE_ARTISTIQUE_ABO',
    'EventType.PRATIQUE_ARTISTIQUE',
  ],
  author: [
    'EventType.CINEMA',
    'EventType.MUSIQUE',
    'ThingType.MUSIQUE',
    'EventType.SPECTACLE_VIVANT',
    'ThingType.LIVRE_EDITION',
  ],
  visa: ['EventType.CINEMA'],
  isbn: ['ThingType.LIVRE_EDITION'],
  musicType: ['EventType.MUSIQUE', 'ThingType.MUSIQUE', 'ThingType.MUSIQUE_ABO'],
  showType: ['EventType.SPECTACLE_VIVANT'],
  stageDirector: ['EventType.CINEMA', 'EventType.SPECTACLE_VIVANT'],
  performer: ['EventType.MUSIQUE', 'ThingType.MUSIQUE', 'EventType.SPECTACLE_VIVANT'],
}

class Offer extends Component {
  componentWillMount() {
    const { dispatch } = this.props
    dispatch(resetForm())
  }

  componentDidMount() {
    this.handleVenueRedirect()
    this.handleShowStocksManager()
    this.setDefaultBookingEmailIfNew()
  }

  componentDidUpdate(prevProps) {
    const {
      dispatch,
      formInitialValues,
      formOffererId,
      formVenueId,
      location,
      offerer,
      offerTypeError,
      selectedOfferType,
      venue,
    } = this.props
    const { search } = location

    if (prevProps.location.search !== search) {
      this.handleShowStocksManager()
      return
    }

    if (
      !formOffererId &&
      ((!offerer && prevProps.offerer) || (!selectedOfferType && prevProps.selectedOfferType))
    ) {
      dispatch(
        mergeForm('offer', {
          offererId: null,
          venueId: null,
        })
      )
    }

    if (!formVenueId && (!venue && prevProps.venue)) {
      dispatch(
        mergeForm('offer', {
          venueId: null,
        })
      )
    }

    this.setDefaultBookingEmailIfNew(prevProps)

    if (get(formInitialValues, 'type') && !selectedOfferType && !offerTypeError) {
      dispatch(
        mergeErrors('offer', {
          type: [
            'Il y a eu un problème avec la création de cette offre: son type est incompatible avec le lieu enregistré.',
          ],
        })
      )
    }
  }

  onHandleDataRequest = (handleSuccess, handleFail) => {
    const {
      history,
      dispatch,
      match: {
        params: { offerId },
      },
      offerers,
      venues,
      providers,
      query,
      types,
    } = this.props
    const { offererId, venueId } = query.translate()

    if (offerId !== 'creation') {
      dispatch(
        requestData({
          apiPath: `/offers/${offerId}`,
          normalizer: offerNormalizer,
        })
      )
    } else if (venueId) {
      requestData({
        apiPath: `/venues/${venueId}`,
        normalizer: {
          managingOffererId: 'offerers',
        },
      })
    } else {
      let offerersPath = '/offerers'
      if (offererId) {
        offerersPath = `${offerersPath}/${offererId}`
      }
      dispatch(
        requestData({
          apiPath: offerersPath,
          handleSuccess: state => {
            const {
              data: { venues },
            } = state
            if (!venues.length) {
              dispatch(
                showModal(
                  <div>
                    {
                      'Vous devez avoir déjà enregistré un lieu dans une de vos structures pour ajouter des offres'
                    }
                  </div>,
                  {
                    onCloseClick: () => history.push('/structures'),
                  }
                )
              )
            }
          },
          handleFail,
          normalizer: { managedVenues: 'venues' },
        })
      )
    }

    if (offerers.length === 0 || venues.length === 0) {
      dispatch(
        requestData({
          apiPath: '/offerers',
          normalizer: { managedVenues: 'venues' },
        })
      )
    }

    if (providers.length === 0) {
      dispatch(requestData({ apiPath: '/providers' }))
    }

    if (types.length === 0) {
      dispatch(requestData({ apiPath: '/types' }))
    }

    handleSuccess()
  }

  handleOnClick = query => event => {
    event.preventDefault()
    query.change({ gestion: '' })
  }

  handleCancelOnClick = (offerId, query) => () => query.changeToReadOnly({}, { id: offerId })

  handleChangeOnClick = query => () => query.changeToModification()

  onHandleFormSuccess = (state, action) => {
    const { offer, query } = this.props
    const previousOfferId = offer && offer.id
    const {
      payload: { datum },
    } = action
    const offerId = datum.id

    const queryParams = previousOfferId ? {} : { gestion: '' }
    query.changeToReadOnly(queryParams, { id: offerId })
  }

  handleVenueRedirect = () => {
    const { offer, query } = this.props
    const translatedQueryParams = query.translate()
    const venueId = get(offer, 'venueId')
    if (venueId && !translatedQueryParams.venueId) {
      query.change({ venueId })
      return
    }
  }

  handleShowStocksManager = () => {
    const { dispatch, query } = this.props
    const { gestion } = query.parse()
    if (typeof gestion === 'undefined') {
      return
    }
    dispatch(
      showModal(<StocksManagerContainer />, {
        isUnclosable: true,
      })
    )
  }

  setDefaultBookingEmailIfNew(prevProps) {
    const { currentUser, dispatch, query, venue } = this.props
    const { isCreatedEntity } = query.context()
    if (!isCreatedEntity) {
      return
    }
    if (!venue) return
    if (!prevProps || !prevProps.venue || venue.id !== prevProps.venue.id) {
      dispatch(
        mergeForm('offer', {
          bookingEmail: (venue && venue.bookingEmail) || currentUser.email,
        })
      )
    }
  }

  hasConditionalField(fieldName) {
    const { selectedOfferType } = this.props
    if (!selectedOfferType) {
      return false
    }

    return CONDITIONAL_FIELDS[fieldName].indexOf(selectedOfferType.value) > -1
  }

  replaceVenueNameByPublicName = venues => {
    return venues.map(venue => {
      return venue.publicName ? { ...venue, name: venue.publicName } : { ...venue }
    })
  }

  render() {
    const {
      currentUser,
      formInitialValues,
      musicSubOptions,
      offer,
      offerer,
      offerers,
      product,
      query,
      stocks,
      selectedOfferType,
      showSubOptions,
      types,
      url,
      venue,
      venues,
    } = this.props

    const { eventId } = offer || {}
    const { isCreatedEntity, isModifiedEntity, method, readOnly } = query.context()

    // FIXME Ne plus utiliser cette selection là, mais plutôt isEvent
    const isEventType = get(selectedOfferType, 'type') === 'Event' || eventId

    const offerId = get(offer, 'id')
    const offererId = get(offerer, 'id')
    const productName = get(product, 'name')
    const showAllForm = selectedOfferType || !isCreatedEntity
    const venueId = get(venue, 'id')
    const isOfferActive = get(offer, 'isActive')
    const isOffererSelectReadOnly = typeof offererId !== 'undefined'
    const isVenueSelectReadOnly = typeof venueId !== 'undefined'
    const isVenueVirtual = get(venue, 'isVirtual')

    const formApiPath = isCreatedEntity ? '/offers' : `/offers/${offerId}`

    let title
    if (isCreatedEntity) {
      title = 'Ajouter une offre'
      if (venueId) {
        if (isVenueVirtual) {
          title = title + ' en ligne'
        } else {
          title = title + ` pour ${get(venue, 'name')}`
        }
      } else if (offererId) {
        title = title + ` pour ${get(offerer, 'name')}`
      }
    } else {
      title = 'Détails de l’offre'
    }

    return (
      <Main
        backTo={{ path: '/offres', label: 'Vos offres' }}
        handleDataRequest={this.onHandleDataRequest}
        name="offer"
      >
        <HeroSection
          subtitle={productName && productName.toUpperCase()}
          title={title}
        >
          <p className="subtitle">
            {
              'Renseignez les détails de cette offre, puis mettez-la en avant en ajoutant une ou plusieurs accroches.'
            }
          </p>

          <p className="fs13 pb30">
            {
              'Les offres payantes seront visibles dans l’application, toutefois les utilisateurs ne pourront les réserver que s’ils ont activé leur portefeuille numérique de 500 € sur Internet ou lors d’un des événements d’activation.'
            }
          </p>

          <Form
            Tag={null}
            action={formApiPath}
            handleSuccess={this.onHandleFormSuccess}
            method={method}
            name="offer"
            patch={formInitialValues}
            readOnly={readOnly}
          >
            <div className="field-group">
              <Field
                isExpanded
                label="Titre de l’offre"
                name="name"
                required
              />
              <Field
                label="Type"
                name="type"
                optionLabel="proLabel"
                optionValue="value"
                options={types}
                placeholder={
                  get(formInitialValues, 'type') && !selectedOfferType
                    ? get(formInitialValues, 'offerTypeValue')
                    : 'Sélectionnez un type d’offre'
                }
                readOnly={offerId && selectedOfferType}
                required
                sublabel="Le type d’offre ne peut pas être modifié une fois l’offre enregistrée."
                type="select"
              />
              {this.hasConditionalField('musicType') && (
                <Fragment>
                  <Field
                    label="Genre musical"
                    name="musicType"
                    optionLabel="label"
                    optionValue="code"
                    options={musicOptions}
                    setKey="extraData"
                    type="select"
                  />

                  {get(musicSubOptions, 'length') > 0 && (
                    <Field
                      label="Sous genre"
                      name="musicSubType"
                      optionLabel="label"
                      optionValue="code"
                      options={musicSubOptions}
                      setKey="extraData"
                      type="select"
                    />
                  )}
                </Fragment>
              )}

              {this.hasConditionalField('showType') && (
                <Fragment>
                  <Field
                    label="Type de spectacle"
                    name="showType"
                    optionLabel="label"
                    optionValue="code"
                    options={showOptions}
                    setKey="extraData"
                    type="select"
                  />

                  {get(showSubOptions, 'length') > 0 && (
                    <Field
                      label="Sous type"
                      name="showSubType"
                      optionLabel="label"
                      optionValue="code"
                      options={showSubOptions}
                      setKey="extraData"
                      type="select"
                    />
                  )}
                </Fragment>
              )}
              {!isCreatedEntity && product && (
                <div className="field is-horizontal field-text">
                  <div className="field-label">
                    <label
                      className="label"
                      htmlFor="input_offers_name"
                    >
                      <div className="subtitle">{isEventType ? 'Dates :' : 'Stocks :'}</div>
                    </label>
                  </div>
                  <div className="field-body">
                    <div
                      className="control"
                      style={{ paddingTop: '0.25rem' }}
                    >
                      <span
                        className="nb-dates"
                        style={{ paddingTop: '0.25rem' }}
                      >
                        {pluralize(get(stocks, 'length'), isEventType ? 'date' : 'stock')}
                      </span>
                      <button
                        className="button is-primary is-outlined is-small manage-stock"
                        onClick={this.handleOnClick(query)}
                        type="button"
                      >
                        <span className="icon">
                          <Icon svg="ico-calendar" />
                        </span>
                        <span>
                          {isEventType ? 'Gérer les dates et les stocks' : 'Gérer les stocks'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {!isCreatedEntity && offer && <MediationsManager />}
            {showAllForm && (
              <div>
                <h2 className="main-list-title">{'Infos pratiques'}</h2>
                <div className="field-group">
                  <Field
                    debug
                    label="Structure"
                    name="offererId"
                    options={offerers}
                    placeholder="Sélectionnez une structure"
                    readOnly={isOffererSelectReadOnly}
                    required
                    type="select"
                  />
                  {offerer && get(venues, 'length') === 0 && (
                    <div className="field is-horizontal">
                      <div className="field-label" />
                      <div className="field-body">
                        <p className="help is-danger">
                          {venue
                            ? 'Erreur dans les données : Le lieu rattaché à cette offre n’est pas compatible avec le type de l’offre'
                            : 'Il faut obligatoirement une structure avec un lieu.'}
                          <Field
                            name="__BLOCK_FORM__"
                            required
                            type="hidden"
                          />
                        </p>
                      </div>
                    </div>
                  )}
                  <Field
                    label="Lieu"
                    name="venueId"
                    options={this.replaceVenueNameByPublicName(venues)}
                    placeholder="Sélectionnez un lieu"
                    readOnly={isVenueSelectReadOnly}
                    required
                    type="select"
                  />
                  {(get(venue, 'isVirtual') || url) && (
                    <Field
                      isExpanded
                      label="URL"
                      name="url"
                      required
                      sublabel={
                        !readOnly &&
                        'Vous pouvez inclure {token} {email} et {offerId} dans l’URL, qui seront remplacés respectivement par le code de la contremarque, l’e-mail de la personne ayant reservé et l’identifiant de l’offre'
                      }
                      type="text"
                    />
                  )}
                  {currentUser.isAdmin && (
                    <Field
                      label="Rayonnement national"
                      name="isNational"
                      type="checkbox"
                    />
                  )}
                  {isEventType && (
                    <Field
                      getDurationInHours={getDurationInHours}
                      getDurationInMinutes={getDurationInMinutes}
                      label="Durée"
                      limitTimeInHours={DURATION_LIMIT_TIME}
                      name="durationMinutes"
                      placeholder="HH:MM"
                      type="duration"
                    />
                  )}
                  <Field
                    label="Email auquel envoyer les réservations"
                    name="bookingEmail"
                    sublabel="Merci de laisser ce champ vide si vous ne souhaitez pas recevoir d’email lors des réservations"
                    type="email"
                  />
                </div>
                <h2 className="main-list-title">{'Infos artistiques'}</h2>
                <div className="field-group">
                  <Field
                    displayMaxLength
                    isExpanded
                    label="Description"
                    maxLength={1000}
                    name="description"
                    rows={readOnly ? 1 : 5}
                    type="textarea"
                  />

                  {this.hasConditionalField('speaker') && (
                    <Field
                      label="Intervenant"
                      name="speaker"
                      setKey="extraData"
                      type="text"
                    />
                  )}

                  {this.hasConditionalField('author') && (
                    <Field
                      label="Auteur"
                      name="author"
                      setKey="extraData"
                      type="text"
                    />
                  )}

                  {this.hasConditionalField('visa') && (
                    <Field
                      isExpanded
                      label="Visa d’exploitation"
                      name="visa"
                      setKey="extraData"
                      sublabel="(obligatoire si applicable)"
                      type="text"
                    />
                  )}

                  {this.hasConditionalField('isbn') && (
                    <Field
                      isExpanded
                      label="ISBN"
                      name="isbn"
                      setKey="extraData"
                      sublabel="(obligatoire si applicable)"
                      type="text"
                    />
                  )}

                  {this.hasConditionalField('stageDirector') && (
                    <Field
                      isExpanded
                      label="Metteur en scène"
                      name="stageDirector"
                      setKey="extraData"
                    />
                  )}

                  {this.hasConditionalField('performer') && (
                    <Field
                      isExpanded
                      label="Interprète"
                      name="performer"
                      setKey="extraData"
                    />
                  )}
                </div>
              </div>
            )}

            <hr />
            <div
              className="field is-grouped is-grouped-centered"
              style={{ justifyContent: 'space-between' }}
            >
              <div className="control">
                {readOnly ? (
                  <button
                    className="button is-secondary is-medium"
                    onClick={this.handleChangeOnClick(query)}
                    type="button"
                  >
                    {'Modifier l’offre'}
                  </button>
                ) : (
                  <button
                    className="button is-secondary is-medium"
                    id="cancel-button"
                    onClick={this.handleCancelOnClick(offerId, query)}
                    type="button"
                  >
                    {'Annuler'}
                  </button>
                )}
              </div>
              <div className="control">
                {readOnly ? (
                  <NavLink
                    className="button is-primary is-medium"
                    to="/offres"
                  >
                    {'Terminer '}
                    {isModifiedEntity && !isOfferActive && 'et activer'}
                  </NavLink>
                ) : (
                  showAllForm && (
                    <SubmitButton className="button is-primary is-medium">
                      {'Enregistrer '}
                      {isCreatedEntity && 'et passer ' + (isEventType ? 'aux dates' : 'aux stocks')}
                    </SubmitButton>
                  )
                )}
              </div>
            </div>
          </Form>
        </HeroSection>
      </Main>
    )
  }
}

Offer.defaultProps = {
  venues: [],
}

Offer.propTypes = {
  currentUser: PropTypes.shape().isRequired,
  dispatch: PropTypes.func.isRequired,
  location: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
  query: PropTypes.shape().isRequired,
  venues: PropTypes.arrayOf(PropTypes.shape()),
}

export default Offer