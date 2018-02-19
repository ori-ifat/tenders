import React, {Component, PropTypes} from 'react'
import CSSModules from 'react-css-modules'
import styles from './ResultsItemDetails.scss'

const Row = ({label, data, html, dir, table}) => {
  const itemStyle = dir ? 'item_key item_ltr' : 'item_key'
  return <div className="grid-x">
    <div className="medium-3 cell">
      <div styleName="item_lable">{label}</div>
    </div>
    <div className="medium-9 cell">
      <div styleName={itemStyle} dangerouslySetInnerHTML={html}>
        {data}
      </div>
      {table && table.length > 0 && <div><Table rows={table} /></div>}
    </div>
  </div>
}

const Table = ({rows}) => {
  //create header and data arrays to map later on return statement
  const header = []
  for (let j = 1; j < 13; j++) {
    //max 13 cols
    if (rows[0][`Col${j}`].trim() != '')
      header.push(rows[0][`Col${j}`])
  }
  const data = []
  for (let i = 1; i < rows.length; i++) {
    //each data array cell will be an array of columns
    const col = []
    for (let j = 1; j < 13; j++) {
      if (rows[i][`Col${j}`].trim() != '') {
        col.push(rows[i][`Col${j}`])
      }
    }
    data.push(col)
  }

  return (<table>
    <thead>
      <tr>
        {header.map((col, index) => <td key={index}>{col}</td>)}
      </tr>
    </thead>
    <tbody>
      {
        data.map((row, index) => {
          const cols = row.map((col, i) => <td key={i}>{col}</td>)
          return <tr key={index}>
            {cols}
          </tr>})
      }
    </tbody>
  </table>
  )
}

export default CSSModules(Row, styles, {allowMultiple: true})
