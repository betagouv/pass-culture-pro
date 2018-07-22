import get from 'lodash.get'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { NavLink } from 'react-router-dom'
import { compose } from 'redux'

import OccurenceForm from './OccurenceForm'
import { mergeFormData } from '../reducers/form'
import { closeModal } from '../reducers/modal'
import eventSelector from '../selectors/event'
import occasionSelector from '../selectors/occasion'
import occurencesSelector from '../selectors/occurences'
import providerSelector from '../selectors/provider'
import timezoneSelector from '../selectors/timezone'
import { queryStringToObject } from '../utils/string'

class OccurenceManager extends Component {

  onCloseClick = e => {
    const {
      occasion,
      history,
      closeModal,
    } = this.props
    closeModal()
    history.push(`/offres/${get(occasion, 'id')}`)
  }

  render() {
    const {
      event,
      location: {search},
      provider,
      occasion,
      occurences,
    } = this.props

    const eventOccurenceId = queryStringToObject(search).dates

    return (
      <div className='occurence-manager'>
        <div className='occurence-table-wrapper'>
          <div className='subtitle has-text-weight-bold has-text-left is-uppercase'>
            {get(event, 'name')}
          </div>
          <div className="pc-title has-text-left">
            Dates, horaires et prix
          </div>
          <table className='table is-hoverable occurence-table'>
            <thead>
              <tr>
                <td>Date</td>
                <td>Heure de début</td>
                <td>Heure de fin</td>
                <td>Prix</td>
                <td>Date Limite de Réservation</td>
                <td>Places (total)</td>
                <td>Supprimer</td>
                <td>Modifier</td>
              </tr>
            </thead>
            <tbody>
              { eventOccurenceId === 'nouvelle' ? (
                <OccurenceForm
                  isFullyEditable={!provider}
                  isEditing
                  isNew
                  occurence={occurences[0]}
                />
              ) : (
                <tr>
                  <td colSpan='10'>
                    { provider ? (
                      <i>
                        Il n'est pas possible d'ajouter ni de supprimer de dates pour cet événement {provider.name}
                      </i>
                    ) : (
                      <NavLink to={`/offres/${get(occasion, 'id')}?dates=nouvelle`} className='button is-secondary'>
                        + Ajouter un horaire
                      </NavLink>
                    )}
                  </td>
                </tr>
              )}
              { occurences.map(o =>
                <OccurenceForm
                  key={o.id}
                  isFullyEditable={!provider}
                  isEditing={o.id === eventOccurenceId}
                  occurence={o}
                />
              )}
            </tbody>
            {occurences.length > 12 && (
              <thead>
                <tr>
                  <td>Date</td>
                  <td>Heure de début</td>
                  <td>Heure de fin</td>
                  <td>Prix</td>
                  <td>Date Limite de Réservation</td>
                  <td>Places (total)</td>
                  <td>Supprimer</td>
                  <td>Modifier</td>
                </tr>
              </thead>
            )}
          </table>
        </div>
        <button
          onClick={this.onCloseClick}
          className="button is-secondary is-pulled-right">
          Fermer
        </button>
      </div>
    )
  }
}

export default compose(
  withRouter,
  connect(
    (state, ownProps) => {
      console.log('ownProps.match.params', ownProps.match.params)
      const occasion = occasionSelector(state, ownProps.match.params.occasionId)
      const { eventId, venueId } = (occasion || {})
      const event = eventSelector(state, eventId)
      const occurences = occurencesSelector(state, venueId, eventId)
      return {
        event,
        occasion,
        occurences,
        provider: providerSelector(state, get(event, 'lastProviderId')),
        tz: timezoneSelector(state, venueId),
      }
    },
    { closeModal, mergeFormData }
  )
)(OccurenceManager)
