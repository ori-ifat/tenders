import React from 'react'
import { bool, object, func } from 'prop-types'
import { observer } from 'mobx-react'
import {observable, toJS} from 'mobx'
import CSSModules from 'react-css-modules'
import styles from './Checkbox.scss'

@CSSModules(styles, {allowMultiple: true})
@observer
export default class Checkbox extends React.Component {

  static propTypes = {
    checked: bool,
    item: object,
    onChange: func
  }

  @observable checked = false

  componentWillMount() {
    const {checked} = this.props
    //console.log('mount', checked)
    this.checked = checked
  }

  onCheck = e => {
    e.stopPropagation()
    const {item, onChange} = this.props
    this.checked = e.target.checked
    onChange(e.target.checked, item.TenderID, item.IsFavorite)
  }

  render() {
    const {item} = this.props
    const {checked} = this.checked
    const cbStyle = this.checked ? 'checkbox_continer checked' : 'checkbox_continer'

    return (
      <div styleName={cbStyle}>
        <div className="checkbox">
          <input type="checkbox"
            className="checkbox_tender"
            checked={checked}
            value={item.TenderID}
            onChange={this.onCheck} />
        </div>
      </div>
    )
  }
}
