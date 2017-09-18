import constants from '../actions/types'
import _ from 'lodash'

export default (state = {}, action) => {
  switch (action.type) {
    case constants.VENUES_FETCH:
      return _.mapKeys(action.payload.data, 'id')

    // case constants.VENUE_SHOWINFO:
    //   return {...state, state.three.showInfo: true}

    // case constants.VENUE_HIDEINFO:
    //   return state.map(venue => {
    //     venue.showInfo = false
    //     return venue
    //   })

    // case constants.VENUE_OPEN:
    //   return state.map(venue => {
    //     if (venue.id === action.payload.id) {
    //       venue.open = true
    //     }
    //     venue.showInfo = false
    //     return venue
    //   })

    // case constants.VENUE_CLOSE:
    //   return state.map(venue => {
    //     venue.open = false
    //     return venue
    //   })

    default:
      return state
  }
}
