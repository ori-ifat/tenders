import React, {Component, PropTypes} from 'react'
import { Link } from 'react-router-dom'
import {getSrc} from './imageResolver'
import CSSModules from 'react-css-modules'
import styles from '../Home.scss'


const CatItem = ({count, subSubjectID, catName}) => {
  const url = `/results/publishDate/[{"ID":${subSubjectID},"Name":"${encodeURIComponent(catName)}","ResType":"subsubject"}]/[]/true`
  return <div styleName="blockitem" className="column column-block">
    <Link to={url} className="main_cat">
      <span styleName="cat_num">{count}</span>
      <h3 styleName="cat_name">{catName}</h3>
      <img src={getSrc(subSubjectID)} alt={catName} styleName="cat_icon" />
    </Link>
  </div>
}

export default CSSModules(CatItem, styles)
