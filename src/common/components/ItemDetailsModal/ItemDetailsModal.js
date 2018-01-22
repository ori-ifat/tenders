import React from 'react'
import ReactModal from 'react-modal'
import ResultsItemDetails from 'common/components/ResultsItemDetails'
import CSSModules from 'react-css-modules'
import styles from './ItemDetailsModal.scss'

@CSSModules(styles)
export default class ItemDetailsModal extends React.Component {

  componentWillMount() {
    ReactModal.setAppElement('#root')
  }

  render() {
    /* modal wrapper for ResultsItemDetails. */
    const { onClose } = this.props
    return (
      <ReactModal
        isOpen={true}
        onRequestClose={onClose}
        className="reveal-custom large"
        overlayClassName="reveal-overlay-custom">
        <ResultsItemDetails {...this.props} />
      </ReactModal>
    )
  }
}
