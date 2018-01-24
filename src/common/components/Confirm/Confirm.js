import React from 'react'
import { func } from 'prop-types'
import { translate } from 'react-polyglot'
import ReactModal from 'react-modal'
import CSSModules from 'react-css-modules'
import styles from './Confirm.scss'

@translate()
@CSSModules(styles)
export default class Confirm extends React.Component {

  static propTypes = {
    onClose: func
  }

  componentWillMount() {
    ReactModal.setAppElement('#root')
  }

  render() {
    const { onClose, t } = this.props
    return (
      <ReactModal
        isOpen={true}
        onRequestClose={onClose}
        className="reveal-custom"
        overlayClassName="reveal-overlay-custom">
        <div styleName="container">
          <div styleName="message">{t('confirm.ask')}</div>
          <div styleName="button-container">
            <button styleName="button" onClick={() => onClose(true)}>{t('confirm.yes')}</button>
            <button styleName="button" onClick={() => onClose(false)}>{t('confirm.no')}</button>
          </div>
        </div>
      </ReactModal>
    )
  }
}
