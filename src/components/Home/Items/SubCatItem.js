import React, {Component, PropTypes} from 'react'
import { Link } from 'react-router-dom'
import CSSModules from 'react-css-modules'
import styles from '../home.scss'

const SubCatItem = ({count, catID, subSubjectID, catName}) => {
  //const url = `/results/publishDate/[{"ID":${subSubjectID},"Name":"${encodeURIComponent(catName)}","ResType":"subsubject"}]/[]/true`
  const url = `/results/publishDate/[{"I":${subSubjectID},"R":"s"}]/[]/true`
  return <div styleName="blockitem_sub" className="column column-block">
    <Link to={url} styleName="subcat">
      {catName}<span> - {count}</span>
    </Link>
  </div>
}

export default CSSModules(SubCatItem, styles)
