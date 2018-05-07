import React from 'react'
import { NavLink } from 'react-router-dom'

import { THUMBS_URL } from '../utils/config'

const OffererItem = ({
  id,
  name,
  style,
  venue
}) => {
  return (
    <NavLink to={`/gestion/${id}`}>
      <article className="offerer-item media"
        onClick={this.onClick}
        style={style}>
        <figure className="media-left">
          <p className="image is-64x64">
            <img alt='thumbnail' src={`${THUMBS_URL}/venues/${venue.id}`}/>
          </p>
        </figure>
        <div className="media-content">
          <div className="content">
            <p className="title">
              <strong>{name}</strong>
            </p>
            <p className="subtitle">
              {venue.address}
            </p>
          </div>
        </div>
      </article>
    </NavLink>
  )
}

export default OffererItem
