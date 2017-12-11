import React, {Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../Home.scss'

const SubCatItem = ({displayName, count, catID, subSubjectID, catName}) => {
  const url = `#/category/${catID}/${subSubjectID}/catName=${catName}`
  return <div className="column column-block" data-font-size="16" data-font-size-type="px" data-line-height="24px">
    <a href={url} className="cat" data-font-size="16" data-font-size-type="px" data-line-height="24px">
      {displayName} {count}
    </a>
  </div>
}

export default CSSModules(SubCatItem, styles)
