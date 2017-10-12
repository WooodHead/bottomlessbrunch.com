import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { ConnectedRouter as Router } from 'react-router-redux'
import { Route } from 'react-router'

import * as actions from '../actions'
import { parsePath } from '../lib/myHelpers'

import MetaData from './common/MetaData'
import MapPage from './MapPage/MapPage'
import Region from './Region'
import IntroPage from './IntroPage/IntroPage'
import VenuePage from './VenuePage/VenuePage'
import Admin from './admin'

import createHistory from 'history/createBrowserHistory'
// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory()

class App extends Component {
  componentDidMount () {
    // get the regions and the venues
    this.props.fetchRegions(
      history,
      // add a callback to fetchUiRegion using history
      this.props.fetchUiRegion
    )
    this.props.fetchVenues()
  }
  componentDidUpdate (prevProps, prevState) {
    // need to change the position of data-react-helmet="true"
    const drhEls = document.querySelectorAll('[data-react-helmet]')
    drhEls.forEach(metaEl => {
      // metaEl.attributes.
      // const first = metaEl.attributes.item(0)
      // const last = metaEl.attributes.item(metaEl.attributes.length - 1)
      // console.log(first, last)
      // const first = metaEl.attributes.setNamedItem(last)
      // metaEl.attributes.removeNamedItem('data-react-helmet')
      let tempAttributes = []
      tempAttributes.push(metaEl.attributes.getNamedItem('data-react-helmet'))
      metaEl.removeAttribute('data-react-helmet')
      ;[...metaEl.attributes].forEach((attr, i) => {
        // console.dir(attr)
        tempAttributes.push(attr)
        metaEl.removeAttribute(attr.name)
        // Object.entries(attr).map(([value, key]) => {
        //   console.log(key, value)
        // })
        // if (attr === 'data-react-helmet') {
        //   metaEl.attributes[i].pop()
        // }
      })
      // console.log(tempAttributes)
      tempAttributes.map(attr => {
        metaEl.setAttribute(attr.name, attr.value)
      })
      console.log(metaEl.attributes)
    })
  }
  render () {
    const regionRoutes = _.map(this.props.regions, region => (
      <Route
        key={region._id}
        path={`/${region.slug}`}
        render={props => <Region {...props} region={region} />}
      />
    ))
    // create the Venue Routes:
    let venueRoutes = null
    if (!_.isEmpty(this.props.regions) && !_.isEmpty(this.props.venues)) {
      venueRoutes = _.map(this.props.venues, venue => {
        return (
          <Route
            key={venue._id}
            path={`/${this.props.regions[venue.regionId].slug}/${venue.slug}`}
            render={props => {
              // the {...props} give us history stuffs
              return (
                <VenuePage
                  {...props}
                  venue={venue}
                  venueId={venue._id}
                  gpId={venue.gpId}
                  regionSlug={this.props.regions[venue.regionId].slug}
                />
              )
            }}
          />
        )
      })
    }
    const parsedHistory = parsePath(history.location.pathname)
    return (
      <div>
        <Router history={history}>
          <div className='App'>
            <MetaData
              path={history.location.pathname}
              {...this.props.ui}
            />
            {/* <Route exact path='/' component={MapPage} /> */}
            <Route path='/admin' render={props => <Admin {...props} />} />
            {venueRoutes}
            {regionRoutes}
            {parsedHistory[0] !== 'admin' &&
              this.props.ui.region &&
              <MapPage history={history} />}
            {parsedHistory[0] !== 'admin' &&
              !this.props.ui.region &&
              <IntroPage history={history} />}
          </div>
        </Router>
      </div>
    )
  }
}

function mapStateToProps ({ venues, regions, ui }) {
  // get the region name:
  if (ui.region && Object.entries(regions).length) {
    ui.regionName = regions[ui.region].name
  }
  // get the venue name:
  if (ui.venueOpenId && Object.entries(venues).length) {
    ui.venueName = venues[ui.venueOpenId].name
  }
  return { venues, regions, ui }
}

export default connect(mapStateToProps, actions)(App)
