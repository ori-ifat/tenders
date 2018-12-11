import React from 'react'
import {observer} from 'mobx-react'
import {observable} from 'mobx'
import {getBanners2 /*, getHomeJSON*/} from 'common/services/apiService'
import {randomNumber} from 'common/utils/util'
import CSSModules from 'react-css-modules'
import styles from './Banners.scss'

@CSSModules(styles)
@observer
export default class Banners extends React.Component {

  @observable banners = [];

  componentWillMount() {
    //json data for hard-coded stuff:
    /*const cache = randomNumber(100000, 1000000)
    getHomeJSON('Banners', 'banners', cache).then(res => {
      this.banners = res.banners
    })*/
    getBanners2().then(res => {
      this.banners = res
    })
  }

  render() {
    //console.log(this.banners)
    const cache = randomNumber(100000, 1000000)
    return(
      <div style={{paddingTop: '20px'}}>
        {
          this.banners.map((banner, index) =>
            <Banner
              key={index}
              id={banner.id}
              type={banner.type}
              url={banner.url}
              landingPage={banner.landingPage}
              width={banner.width}
              height={banner.height}
              cache={cache}
            />)
        }
      </div>
    )
  }
}

const Banner = ({id, type, url, landingPage, width, height, cache}) => {
  if (type == 'html') {
    return <iframe
      id={`Banner${id}`}
      width={width}
      height={height}
      src={`${url}?cache=${cache}`}
      style={{border: 'none', marginBottom: '10px'}}
    ></iframe>
  }
  else {
    return <div id={`Banner${id}`}
      width={width}
      height={height}
      style={{marginBottom: '10px'}}>
      <a href={landingPage} target="_blank">
        <img
          src={`${url}?cache=${cache}`}
          width={width}
          height={height}
        />
      </a>
    </div>
  }
}
/*
const Banner = ({url}) => {
  return <div style={{ padding: '30px', border: '1px solid #DEDEDE', marginTop: '1rem', color: '#DEDEDE', textAlign: 'center'}}>Banner</div>
}*/
