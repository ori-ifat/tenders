import React, {Component, PropTypes} from 'react'
import {getSrc} from './imageResolver'
import CSSModules from 'react-css-modules'
import styles from '../Home.scss'


const CatItem = ({count, subSubjectID, catName}) => {
  const url = `#/category/${count}/${subSubjectID}/${catName}`
  return <div className="column column-block">
    <a href={url} target="_blank" styleName="main_cat">
      <span styleName="cat_num">{count}</span>
      <h3 styleName="cat_name">{catName}</h3>
      <img src={getSrc(subSubjectID)} alt="" styleName="cat_icon" />
    </a>
  </div>
}

export default CSSModules(CatItem, styles)
