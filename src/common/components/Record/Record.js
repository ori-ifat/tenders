import React from 'react'
import { observer } from 'mobx-react'
import CSSModules from 'react-css-modules'
import styles from './Record.scss'
import ResultsItem from 'common/components/ResultsItem'
import ResultsItemDetails from 'common/components/ResultsItemDetails'

@CSSModules(styles)
@observer
export default class Record extends React.Component {
  /* wrapper for item with\without details */
  state = {
    selected: false
  }

  viewDetails = () => {
    //this.setState({selected: true})
    const { item: { TenderID } } = this.props
    console.log('TenderID', TenderID)
  }

  closeDetails = () => {
    this.setState({selected: false})
  }

  render() {
    const { item } = this.props
    const { selected } = this.state

    return (
      <div>
        {!selected &&
          <ResultsItem item={item} onClick={this.viewDetails} />
        }
        {selected &&
          <ResultsItemDetails item={item} onClose={this.closeDetails} />
        }
      </div>
    )
  }
}
