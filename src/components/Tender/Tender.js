import React, {Component} from 'react'
import { withRouter } from 'react-router'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import {getImageUrl} from 'common/utils/util'
import ResultsItemDetails from 'common/components/ResultsItemDetails'
import ImageView from 'common/components/ImageView'
import CSSModules from 'react-css-modules'
import styles from './tender.scss'

@withRouter
@observer
@CSSModules(styles, { allowMultiple: true })
export default class Tender extends Component {

  @observable itemID = -1
  @observable showImage = false
  @observable imageUrl = ''
  @observable imageTitle = ''

  componentWillMount() {
    const { match: {params: { itemId }} } = this.props
    this.itemID = parseInt(itemId)
  }

  showViewer = (fileName, title) => {
    const url = getImageUrl(fileName)
    this.imageUrl = url
    this.imageTitle = title
    this.showImage = true
  }

  closeViewer = () => {
    this.showImage = false
  }

  render() {
    return (
      <div className="row">
        <div className="column large-12">
          <div>
            {!this.showImage ?
              <ResultsItemDetails
                onClose={this.closeViewer}
                itemID={this.itemID}
                showViewer={this.showViewer}
                mode="singleItem"
              />
              :
              <ImageView
                onClose={this.closeViewer}
                url={this.imageUrl}
                title={this.imageTitle}
              />
            }
          </div>
        </div>
      </div>
    )
  }
}
