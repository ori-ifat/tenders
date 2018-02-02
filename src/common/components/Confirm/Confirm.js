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
          <h3 styleName="message">מחיקת תזכורת</h3>
          <p styleName="sub">האם אתה בטוח שברצונך למחוק את התזכורת? </p>
          <div styleName="button-container">
            <button className="button" styleName="btn" onClick={() => onClose(true)}>מחק</button>
            <button className="clear button secondary" styleName="btn" onClick={() => onClose(false)}>בטל </button>
          </div>
        </div>
      </ReactModal>
    )
  }
}
