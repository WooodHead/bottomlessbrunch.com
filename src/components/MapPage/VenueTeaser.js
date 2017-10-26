import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { compileDays } from '../../lib/myHelpers'

class VenueTeaser extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isActive: false
    }
  }
  componentWillReceiveProps (nextProps) {
    // set the isActve bool based on if this venue is the hovered venue:
    this.setState({isActive: nextProps.venue._id === nextProps.hoveredVenue})
  }
  shouldComponentUpdate (nextProps, nextState) {
    // return TRUE if there's a change in the isActive bool
    return nextState.isActive !== this.state.isActive
  }
  render () {
    const {
      venue,
      regionSlug,
      regionName,
      handleMouseOver,
      handleMouseLeave,
      toggleMarkerClick,
      altClass
    } = this.props
    const hovered = this.state.isActive ? 'is-hovered' : 'not-hovered'

    const renderedImage = venue.gData && venue.gData.images
      ? <div
        className={`VenueTeaser__image-container ${altClass}__image-container`}
        style={{ backgroundImage: `url(${venue.gData.images.large[0].url})` }}
        />
      : ''
    // const funTimes = compileDays(venue.funTimes, 'Bottomless Brunch', venue.name)
    return (
      <article
        className={`VenueTeaser ${altClass} ${hovered}`}
        onMouseEnter={handleMouseOver(venue)}
        onMouseLeave={handleMouseLeave(venue)}
        onClick={toggleMarkerClick(venue)}
      >
        {altClass === 'MapItem' &&
          <div className='MapItem__marker-container'>
            <span className='MapItem__mimosa' />
            <span className='MapItem__marker' />
          </div>
        }
        {/* THE VENUETEASER__INNER is where the real link should be... */}
        <Link
          regionName={regionName}
          className={`VenueTeaser__link ${altClass}__link`}
          to={`/${regionSlug}/${venue.slug}`}
        >
          <div className={`VenueTeaser__inner ${altClass}__inner`}>
            {renderedImage}
            <div className={`VenueTeaser__content ${altClass}__content`}>
              <h3 className={`VenueTeaser__title ${altClass}__title`}>
                {venue.name}
              </h3>
              {venue.address &&
                <p className={`VenueTeaser__p ${altClass}__p`}>
                  {venue.address.street}, {venue.address.city}
                </p>}
              {/* {funTimes &&
                <div className={`VenueTeaser__funtimes ${altClass}__funtimes`}>
                  <h4 className={`VenueTeaser__sub-title ${altClass}__sub-title`}>
                    Go Bottomless
                  </h4>
                  {funTimes.map((fun, i) => (
                    <p key={i} className={`VenueTeaser__p ${altClass}__p`}>
                      <strong>{fun.day}</strong> {fun.startTime} - {fun.endTime}
                    </p>
                  ))}
                </div>
              } */}
              {venue.funItems.length > 0 &&
                <div className={`VenueTeaser__funtimes ${altClass}__funtimes`}>
                  <h4 className={`VenueTeaser__sub-title ${altClass}__sub-title`}>
                    Bottomless Deals
                  </h4>
                  {venue.funItems.map((item, i) => (
                    <p key={i} className={`VenueTeaser__p ${altClass}__p`}>
                      <strong>${item.price}</strong> {item.name}
                    </p>
                  ))}
                </div>
              }
              <button className={`VenueTeaser__more-info ${altClass}__more-info`}>
                <span className='text'>More Info</span>
                <span className='chevron'>»</span>
              </button>
            </div>
          </div>
        </Link>
      </article>
    )
  }
}

export default VenueTeaser
