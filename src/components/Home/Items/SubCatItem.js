import React, {Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../Home.scss'

const SubCatItem = ({count, catID, subSubjectID, catName}) => {
  //const url = `#/category/${count}/${subSubjectID}/${catName}`
  const url = `#/results/publishDate/[{"ID":${subSubjectID},"Name":"${catName}","ResType":"subsubject"}]/[]`
  return <div className="column column-block">
    <a href={url} target="_blank" styleName="subcat">
      {catName} {count}
    </a>
  </div>
}

export default CSSModules(SubCatItem, styles)
