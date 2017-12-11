import React, {Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'
import styles from '../Home.scss'

const CatItem = ({displayName, count, catID, subSubjectID, catName, imgSrc}) => {
  const url = `#/category/${catID}/${subSubjectID}/catName=${catName}`
  return <div className="column column-block" data-font-size="16" data-font-size-type="px" data-line-height="24px">
    <a href={url} styleName="main_cat" data-font-size="16" data-font-size-type="px" data-line-height="16px">
      <span styleName="cat_num" data-font-size="28" data-font-size-type="px" data-line-height="28px">{count}</span>
      <h3 styleName="cat_name" data-font-size="16" data-font-size-type="px" data-line-height="20px">{displayName}</h3>
      <img src={imgSrc} alt="" styleName="cat_icon" />
    </a>
  </div>
}

export default CSSModules(CatItem, styles)
