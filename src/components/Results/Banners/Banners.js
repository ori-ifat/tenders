import React from 'react'
import {observer} from 'mobx-react'
import {observable} from 'mobx'
import {getHomeJSON} from 'common/services/apiService'
import {randomNumber} from 'common/utils/util'
import CSSModules from 'react-css-modules'
import styles from './Banners.scss'

@CSSModules(styles)
@observer
export default class Banners extends React.Component {

  @observable banners = [];

  componentWillMount() {
    //json data for hard-coded stuff:
    const cache = randomNumber(100000, 1000000)
    getHomeJSON('Banners', 'banners', cache).then(res => {
      this.banners = res.banners
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
              url={banner.url}
              width={banner.width}
              height={banner.height}
              cache={cache}
            />)
        }
      </div>
    )
  }
}

const Banner = ({id, url, width, height, cache}) => {
  return <iframe
    id={`Banner${id}`}
    width={width}
    height={height}
    src={`${url}?cache=${cache}`}
    style={{border: 'none'}}
  ></iframe>
}
/*
const Banner = ({url}) => {
  return <div style={{ padding: '30px', border: '1px solid #DEDEDE', marginTop: '1rem', color: '#DEDEDE', textAlign: 'center'}}>Banner</div>
}*/
