import React, {Component} from 'react'
import Viewer from 'react-viewer'
import 'react-viewer/dist/index.css'
import CSSModules from 'react-css-modules'
import styles from './style.scss'

@CSSModules(styles)
class ImageViewer extends Component {

  state = {
    isOpen: false
  }

  toggle = () => {
    const {mode} = this.props
    /* open the viewer instead of the smaller div with the background-image */
    this.setState({
      isOpen: !mode && !this.state.isOpen
    })
  }

  render() {
    //const src = this.props.filepath
    const src = 'http://www.gettyimages.com/gi-resources/images/Embed/new/embed2.jpg'
    const {isOpen} = this.state

    const images = [{
      src,
      alt: ''
    }]

    return (
      <div styleName="image-viewer">
        <div style={{position: 'absolute', top: this.props.top}}>
          <Viewer visible={isOpen} images={images} onClose={this.toggle}/>
        </div>
        {
          !isOpen && <div styleName="image" style={{backgroundImage: `url(${src})`}} onClick={this.toggle}/>
        }
      </div>
    )
  }
}

export default ImageViewer
