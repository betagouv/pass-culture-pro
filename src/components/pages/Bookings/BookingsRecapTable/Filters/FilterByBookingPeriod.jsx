import moment from 'moment/moment'
import PropTypes from 'prop-types'
import React from 'react'

import PeriodSelector from 'components/layout/inputs/PeriodSelector/PeriodSelector'

import { EMPTY_FILTER_VALUE } from './_constants'
import { formatDateYYYYMMDD } from "../../../../../utils/date"

const FilterByBookingPeriod = ({
  isDisabled,
  oldestBookingDate,
  updateFilters,
  selectedBookingBeginningDate,
  selectedBookingEndingDate,
}) => {
  function handleBookingBeginningDateChange(bookingBeginningDate) {
    const dateToFilter =
      bookingBeginningDate === null ? EMPTY_FILTER_VALUE : formatDateYYYYMMDD(bookingBeginningDate)
    const updatedFilter = { bookingBeginningDate: dateToFilter }
    const updatedSelectedContent = { selectedBookingBeginningDate: bookingBeginningDate }
    updateFilters(updatedFilter, updatedSelectedContent)
  }

  function handleBookingEndingDateChange(bookingEndingDate) {
    const dateToFilter =
      bookingEndingDate === null ? EMPTY_FILTER_VALUE : formatDateYYYYMMDD(bookingEndingDate)
    const updatedFilter = { bookingEndingDate: dateToFilter }
    const updatedSelectedContent = { selectedBookingEndingDate: bookingEndingDate }
    updateFilters(updatedFilter, updatedSelectedContent)
  }

  return (
    <PeriodSelector
      changePeriodBeginningDateValue={handleBookingBeginningDateChange}
      changePeriodEndingDateValue={handleBookingEndingDateChange}
      isDisabled={isDisabled}
      label="Période de réservation"
      maxDateEnding={new Date()}
      minDateBeginning={oldestBookingDate}
      periodBeginningDate={selectedBookingBeginningDate}
      periodEndingDate={selectedBookingEndingDate}
    />
  )
}

FilterByBookingPeriod.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  oldestBookingDate: PropTypes.string.isRequired,
  selectedBookingBeginningDate: PropTypes.oneOfType([PropTypes.shape(), PropTypes.string])
    .isRequired,
  selectedBookingEndingDate: PropTypes.oneOfType([PropTypes.shape(), PropTypes.string]).isRequired,
  updateFilters: PropTypes.func.isRequired,
}

export default FilterByBookingPeriod
