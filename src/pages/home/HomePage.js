import React, {Component} from 'react'
//import HomeComponent from 'components/Home'
import WrapperComponent from 'components/Wrapper'
//import CSSModules from 'react-css-modules'
//import styles from './Home.scss'

//@CSSModules(styles)
export default class Home extends Component {


  //componentWillMount() {}

  //componentWillReceiveProps = (nextProps, nextState) => {};

  render(){
    return <div>
      <WrapperComponent
        use="home"
      />
    </div>
  }
}
