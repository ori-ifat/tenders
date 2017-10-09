import React from 'react'
import { observer } from 'mobx-react'
import CSSModules from 'react-css-modules'
import styles from './ResultsItemDetails.scss'

@CSSModules(styles)
@observer
export default class ResultsItemDetails extends React.Component {

  render() {
    const { item, onClose } = this.props    

    return (
      <div>{item.TenderID} <a onClick={onClose}>close</a></div>
    )
  }
}
