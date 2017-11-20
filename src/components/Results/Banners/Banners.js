import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './Banners.scss'

@CSSModules(styles)
export default class Banners extends React.Component {

  render() {
    return(
      <div style={{paddingTop: '20px'}}>
        <Banner />
        <Banner />
        <Banner />
        <Banner />
      </div>
    )
  }
}

const Banner = ({}) => {
  return <div style={{ padding: '30px', border: '1px solid #DEDEDE', marginTop: '1rem', color: '#DEDEDE', textAlign: 'center'}}>Banner</div>
}
