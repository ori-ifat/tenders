import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './Banners.scss'

@CSSModules(styles)
export default class Banners extends React.Component {

  render() {
    return(
      <div>
        <div>Banner</div>
        <div>Banner</div>
        <div>Banner</div>
        <div>Banner</div>
      </div>
    )
  }
}
