import React, {Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../Home.scss'

const Article = ({articleID, title, imgSrc}) => {
  const url = `#/article/${articleID}`
  return  <div className="medium-4 columns" data-font-size="16" data-font-size-type="px" data-line-height="24px">
    <a href={url} data-font-size="16" data-font-size-type="px" data-line-height="24px">
      <img src={imgSrc} alt="" />
      <h3 styleName="one-article-title" data-font-size="18" data-font-size-type="px" data-line-height="23.4px">{title}</h3>
    </a>
  </div>
}

export default CSSModules(Article, styles)
