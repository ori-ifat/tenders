import React, {Component, PropTypes} from 'react'
import { Link } from 'react-router-dom'
import CSSModules from 'react-css-modules'
import styles from '../Home.scss'

const SubCatItem = ({count, catID, subSubjectID, catName}) => {
  const url = `/results/publishDate/[{"ID":${subSubjectID},"Name":"${encodeURIComponent(catName)}","ResType":"subsubject"}]/[]/true`
  return <div styleName="blockitem_sub" className="column column-block">
    <Link to={url} styleName="subcat">
      {catName}<span> - {count}</span>
    </Link>
  </div>
}

export default CSSModules(SubCatItem, styles)
