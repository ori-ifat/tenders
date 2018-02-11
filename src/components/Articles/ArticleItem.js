import React, {Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'
import styles from './articles.scss'

const ArticleItem = ({id, title, date, author, image}) => {
  const url = `#/article/${id}`
  return <a styleName="article_ttl" href={url} target="_blank">
    <div className="media-object stack-for-small">
      <div className="media-object-section">
        <img src={image} />
      </div>
      <div className="media-object-section main-section">
        <h3 styleName="article-title">{title}</h3>
        <p styleName="post_meta">{date}<span styleName="v_line">|</span> {author} </p>
      </div>
    </div>
  </a>
}

export default CSSModules(ArticleItem, styles)
