import React, {Component} from 'react'
import {observer} from 'mobx-react'
import {observable} from 'mobx'
//import enhanceWithClickOutside from 'react-click-outside'
import CSSModules from 'react-css-modules'
import styles from './SearchInput.scss'

//@enhanceWithClickOutside
@observer
@CSSModules(styles)
export default class SavedSearches extends Component {
  @observable firstLoad = false

/*
  handleClickOutside() {
    console.log('handleClickOutside')
    //this.toggle()
    if (!this.firstLoad){
      this.props.close()
    }
    else {
      this.firstLoad = true
    }
  }

  toggle() {
    this.isOpen = !this.isOpen
  }
*/
  render() {
    return (
      <div className="row">
        <div className="medium-12 columns">
          <div style={{zIndex: '1000', backgroundColor: 'whitesmoke', width: '90%', height: '600px', position: 'absolute', boxShadow: '2px 5px 5px grey'}}>aaa</div>
        </div>
      </div>
    )
  }
}
