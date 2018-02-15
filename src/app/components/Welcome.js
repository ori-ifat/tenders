import React from 'react'
import { bool, func } from 'prop-types'
import ReactModal from 'react-modal'

const req = require.context('common/style/icons/', false)
const logoSrc = req('./Welcome.png')

export default class Welcome extends React.Component {
  /* that component is used to show a 'welcome' image to clients. open status of dialog is set on callee (Topbar.js) */

  static propTypes = {
    isDialogOpened: bool,
    closeDialog: func
  }

  componentWillMount() {
    ReactModal.setAppElement('#root')
  }

  render() {
    const {isDialogOpened, closeDialog} = this.props
    return (
      <ReactModal
        isOpen={isDialogOpened}
        onRequestClose={closeDialog}
        className="reveal-custom reveal-custom-welcome"
        overlayClassName="reveal-overlay-custom">
        <div style={{width: '550px', height: '550px'}}>
          <div
            style={{position: 'absolute', top: '0', right: '0', zIndex: '2000', width: '40px', height: '40px', cursor: 'pointer'}}
            onClick={closeDialog}
          >
            &nbsp;
          </div>
          <img src={logoSrc} />
        </div>
      </ReactModal>
    )
  }
}
