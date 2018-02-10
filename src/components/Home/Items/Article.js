import React, {Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../Home.scss'

const Article = ({articleID, title, imgSrc}) => {
  const url = `#/article/${articleID}`
  return  <div className="medium-4 small-12 columns">
    <a href={url}>
      <img src={imgSrc} alt={title} />
      <h3 styleName="one-article-title">{decodeURIComponent(title)}</h3>
    </a>
  </div>
}

export default CSSModules(Article, styles)
