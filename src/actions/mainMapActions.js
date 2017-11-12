import _ from 'lodash'
import constants from './types'

export function setMainMap (coords) {
  // console.log('settings coords:', coords)
  return {
    type: constants.MAIN_MAP_SET,
    payload: coords
  }
}
// size = {width: n, height: n}
export function updateMainMapSize (size) {
  return {
    type: constants.MAIN_MAP_UPDATE_SIZE,
    payload: size
  }
}

export function getMainMapVisibleVenues (
  venues,
  regions,
  coords,
  fetchVenueDetail,
  history
) {
  const { ne, sw } = coords.bounds
  let visibleVenuesArr = []
  let visibleRegionsObj = {}
  let regionReset = ''
  let regionTitle = 'Choose Region'
  // loop through all the venues:
  _.map(venues, venue => {
    // check if the venue is within the map's coords:
    if (
      venue.lat <= ne.lat &&
      venue.lat >= sw.lat &&
      venue.lng <= ne.lng &&
      venue.lng >= sw.lng
    ) {
      // add the venue to the visibleVenuesArr:
      visibleVenuesArr.push(venue._id)
      // VISIBLE REGIONS LOGIC:
      // check if this region has been saved yet:
      if (!visibleRegionsObj[venue.regionId]) {
        // if not, add it to visibleRegionsObj
        visibleRegionsObj[venue.regionId] = {
          name: regions[venue.regionId].name,
          _id: venue.regionId,
          venuesVisible: 1
        }
      } else {
        // just increment the venuesVisible:
        visibleRegionsObj[venue.regionId].venuesVisible++
      }
      // finally, since the venue is visible, we need to get more data for it:
      if (venue.fetchedLevel === 'minimal') {
        fetchVenueDetail(venue._id, 'teaser')
      }
    }
  })
  // POST VENUE CHECKING:
  // check if we're inside a region, just no venues are currently visible:
  if (_.isEmpty(visibleRegionsObj)) {
    _.map(regions, region => {
      if (
        region.bounds &&
        coords.center.lat <= region.bounds.north &&
        coords.center.lat >= region.bounds.south &&
        coords.center.lng <= region.bounds.east &&
        coords.center.lng >= region.bounds.west
      ) {
        // SINGLE REGION
        visibleRegionsObj[region._id] = {
          name: region.name,
          _id: region._id,
          venuesVisible: 0
        }
      } else {
        // NO REGION:
        // we need to call the thing that changes the region
      }
    })
  } else {
    // visibleRegionsObj has data. let's do some checks on it:
    const keys = _.keysIn(visibleRegionsObj)
    if (keys.length === 1) {
      // we have only 1 region visible
      // let's check if we're showing less than all the venues:
      if (
        visibleRegionsObj[keys[0]].venuesVisible <
        regions[keys[0]].venuesAvailable
      ) {
        // PARTIAL SINGLE REGION:
        // history.push('/' + regions[visibleRegionsObj[keys[0]]._id].slug)
        regionReset = '/' + regions[visibleRegionsObj[keys[0]]._id].slug
        regionTitle = visibleRegionsObj[keys[0]].name
      } else {
        // FULL SINGLE REGION:
        // history.push('/' + regions[visibleRegionsObj[keys[0]]._id].slug)
        regionTitle = visibleRegionsObj[keys[0]].name
      }
    } else {
      // MULTIPLE REGIONS
      // history.replace('/')
      regionTitle = 'Multiple Regions'
    }
  }
  return {
    type: constants.MAIN_MAP_SET_VISIBLE_VENUES_AND_REGIONS,
    payload: {
      visibleVenuesArr,
      visibleRegionsObj,
      regionTitle,
      regionReset
    }
  }
}
