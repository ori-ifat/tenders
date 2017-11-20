import React, {Component} from 'react'
//import ResultsComponent from 'components/Results'
import WrapperComponent from 'components/Wrapper'
//import CSSModules from 'react-css-modules'
//import styles from './Results.scss'

//@CSSModules(styles)
export default class Results extends Component {


  //componentWillMount() {}
  //componentWillReceiveProps = (nextProps, nextState) => {};

  render(){
    return <div>
      <WrapperComponent
        use="results"
      />
    </div>
  }
}
