import React, {Component} from 'react'
import {observer} from 'mobx-react'
import {observable, toJS} from 'mobx'

@observer
export default class Test extends Component {
/*
  state = {
    num: 1
  }*/

  @observable num = 1

  onClick = () => {
    console.log('test onclick')
    //const {num} = this.state
    //let _num = parseInt(num)
    let _num = parseInt(this.num)
    _num++
    //this.setState({num: _num})
    this.num = _num
  }

  render() {
    console.log('render')
    return (
      <div>Test<br />
        <button onClick={this.onClick}>Click {this.num}</button>
      </div>
    )
  }
}
