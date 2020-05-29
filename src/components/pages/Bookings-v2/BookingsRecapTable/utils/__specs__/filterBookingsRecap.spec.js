import filterBookingsRecap from '../filterBookingsRecap'

describe('filterBookingsRecap', () => {
  it('should return list when no filters provided', () => {
    // given
    const bookingsRecap = [
      {
        stock: {
          offer_name: 'Merlin enchanteur',
        },
        beneficiary: {
          lastname: 'Klepi',
          firstname: 'Sonia',
          email: 'sonia.klepi@example.com',
        },
        booking_date: '2020-04-03T12:00:00Z',
        booking_token: 'ZEHBGD',
        booking_status: 'Validé',
      }
    ]
    const filters = {
      offerName: null,
      offerDate: null
    }

    // when
    const filteredBookingsRecap = filterBookingsRecap(bookingsRecap, filters)

    // then
    expect(filteredBookingsRecap).toStrictEqual(bookingsRecap)
  })

  it('should return list containing only BookingRecap matching offerName keywords', () => {
    // given
    const bookingRecap1 = {
      stock: {
        offer_name: 'Merlin enchanteur',
      },
      beneficiary: {
        lastname: 'Klepi',
        firstname: 'Sonia',
        email: 'sonia.klepi@example.com',
      },
      booking_date: '2020-04-03T12:00:00Z',
      booking_token: 'ZEHBGD',
      booking_status: 'Validé',
    }
    const bookingRecap2 = {
      stock: {
        offer_name: 'Jurrasic Perk',
      },
      beneficiary: {
        lastname: 'Klepi',
        firstname: 'Sonia',
        email: 'sonia.klepi@example.com',
      },
      booking_date: '2020-04-03T12:00:00Z',
      booking_token: 'ZACBGD',
      booking_status: 'Validé',
    }
    const bookingsRecap = [
      bookingRecap1,
      bookingRecap2
    ]
    const filters = {
      offerName: 'Merlin',
      offerDate: null
    }


    // when
    const filteredBookingsRecap = filterBookingsRecap(bookingsRecap, filters)

    // then
    expect(filteredBookingsRecap).toStrictEqual([bookingRecap1])
  })

  it('should not return element when BookingRecap is a thing and search with offerDate', () => {
    // given
    const bookingRecap = {
      stock: {
        offer_name: 'Merlin enchanteur',
      },
      beneficiary: {
        lastname: 'Klepi',
        firstname: 'Sonia',
        email: 'sonia.klepi@example.com',
      },
      booking_date: '2020-04-03T12:00:00Z',
      booking_token: 'ZEHBGD',
      booking_status: 'Validé',
    }
    const bookingsRecap = [
      bookingRecap
    ]
    const filters = {
      offerName: null,
      offerDate: "2020-02-18",
    }

    // when
    const filteredBookingsRecap = filterBookingsRecap(bookingsRecap, filters)

    // then
    expect(filteredBookingsRecap).toStrictEqual([])
  })

  it('should return list containing only BookingRecap matching given offerDate', () => {
    // given
    const bookingRecap1 = {
      stock: {
        offer_name: 'Merlin enchanteur',
        event_beginning_datetime: '2020-03-03T12:00:00Z',
      },
      beneficiary: {
        lastname: 'Klepi',
        firstname: 'Sonia',
        email: 'sonia.klepi@example.com',
      },
      booking_date: '2020-04-03T12:00:00Z',
      booking_token: 'ZEHBGD',
      booking_status: 'Validé',
    }
    const bookingRecap2 = {
      stock: {
        offer_name: 'Jurrasic Perk',
        event_beginning_datetime: '2020-01-14T12:00:00Z',
      },
      beneficiary: {
        lastname: 'Klepi',
        firstname: 'Sonia',
        email: 'sonia.klepi@example.com',
      },
      booking_date: '2020-02-18T12:00:00Z',
      booking_token: 'ZACBGD',
      booking_status: 'Validé',
    }
    const bookingsRecap = [
      bookingRecap1,
      bookingRecap2
    ]
    const filters = {
      offerName: null,
      offerDate: "2020-01-14",
    }

    // when
    const filteredBookingsRecap = filterBookingsRecap(bookingsRecap, filters)

    // then
    expect(filteredBookingsRecap).toStrictEqual([bookingRecap2])
  })

  it('should return list containing only BookingRecap matching given offerDate and offerName', () => {
    // given
    const bookingRecap1 = {
      stock: {
        offer_name: 'Jurrasic Perk',
        event_beginning_datetime: '2020-01-18T12:00:00Z',
      },
      beneficiary: {
        lastname: 'Klepi',
        firstname: 'Sonia',
        email: 'sonia.klepi@example.com',
      },
      booking_date: '2020-04-03T12:00:00Z',
      booking_token: 'ZEHBGD',
      booking_status: 'Validé',
    }
    const bookingRecap2 = {
      stock: {
        offer_name: 'Jurrasic Perk',
        event_beginning_datetime: '2020-01-14T12:00:00Z',
      },
      beneficiary: {
        lastname: 'Klepi',
        firstname: 'Sonia',
        email: 'sonia.klepi@example.com',
      },
      booking_date: '2020-02-18T12:00:00Z',
      booking_token: 'ZACBGD',
      booking_status: 'Validé',
    }
    const bookingsRecap = [
      bookingRecap1,
      bookingRecap2
    ]
    const filters = {
      offerName: 'Jurrasic',
      offerDate: "2020-01-14",
    }

    // when
    const filteredBookingsRecap = filterBookingsRecap(bookingsRecap, filters)

    // then
    expect(filteredBookingsRecap).toStrictEqual([bookingRecap2])
  })

  it('should return list containing only BookingRecap matching given offerDate and offerName v2', () => {
    // given
    const bookingRecap1 = {
      stock: {
        offer_name: 'Matrix',
        event_beginning_datetime: '2020-01-14T12:00:00Z',
      },
      beneficiary: {
        lastname: 'Klepi',
        firstname: 'Sonia',
        email: 'sonia.klepi@example.com',
      },
      booking_date: '2020-04-03T12:00:00Z',
      booking_token: 'ZEHBGD',
      booking_status: 'Validé',
    }
    const bookingRecap2 = {
      stock: {
        offer_name: 'Jurrasic Perk',
        event_beginning_datetime: '2020-01-14T12:00:00Z',
      },
      beneficiary: {
        lastname: 'Klepi',
        firstname: 'Sonia',
        email: 'sonia.klepi@example.com',
      },
      booking_date: '2020-02-18T12:00:00Z',
      booking_token: 'ZACBGD',
      booking_status: 'Validé',
    }
    const bookingsRecap = [
      bookingRecap1,
      bookingRecap2
    ]
    const filters = {
      offerName: 'Jurrasic',
      offerDate: "2020-01-14",
    }

    // when
    const filteredBookingsRecap = filterBookingsRecap(bookingsRecap, filters)

    // then
    expect(filteredBookingsRecap).toStrictEqual([bookingRecap2])
  })

})