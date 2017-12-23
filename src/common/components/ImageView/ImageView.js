import React, {Component} from 'react'
import { string, func } from 'prop-types'
import ImageViewer from 'react-image-viewer-zoom'
import 'react-image-viewer-zoom/dist/style.css'
import './style.scss'

const req = require.context('common/style/icons/', false)
const closeSrc = req('./close.svg')

class ImageView extends Component {

  static propTypes = {
    onClose: func,
    url: string,
    title: string
  }

  render() {
    //src: 'http://www.gettyimages.com/gi-resources/images/Embed/new/embed2.jpg', title: 'title', content: 'content'
    const {url, title} = this.props
    const images: any = [
      { src: url, title }
    ]

    return (
      <div>
        <ImageViewer
          showPreview={true}
         	showIndex={false}
          prefixCls="react-image-viewer"
          activeIndex={0}
          images={images} />

      </div>
    )
  }
}

export default ImageView
