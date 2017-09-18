import _ from 'lodash'
import constants from '../actions/types'

export default (state = {}, action) => {
  switch (action.type) {
    case constants.VENUES_FETCH:
      return _.mapKeys(action.payload.data, 'id')
    default:
      return state
  }
}
