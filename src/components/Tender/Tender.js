import React, {Component} from 'react'
import { withRouter } from 'react-router'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'
import {getImageUrl} from 'common/utils/util'
import ResultsItemDetails from 'common/components/ResultsItemDetails'
import ImageView from 'common/components/ImageView'
import NotLogged from 'common/components/NotLogged'
import CSSModules from 'react-css-modules'
import styles from './tender.scss'

@withRouter
@inject('accountStore')
@observer
@CSSModules(styles)
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
    const {accountStore: {profile}} = this.props
    return (
      <div className="row">
        {profile ?
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
                  tenderID={this.itemID}
                />
              }
            </div>
          </div>
          :
          <NotLogged />
        }
      </div>
    )
  }
}
