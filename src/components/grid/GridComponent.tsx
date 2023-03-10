import React, { Component } from 'react'
import './GridComponent.scss';

type Props = {
  items: any[],
  cols: number,
  style: React.CSSProperties,
};

export default class GridComponent extends React.Component<Props, any> {
  render() {
    let items = [];
    if (this.props.items) {
      items = this.props.items;
    }
    const repeat = this.props.cols ? this.props.cols : items.length;
    const gridAutoColumns = 'auto '.repeat(repeat);
    const msGridAutoColumns = 'auto '.repeat(repeat);

    let gridColumn = 1;
    let gridRow = 1;

    return (
      <div className="grid-container" style={{
        ...this.props.style,
        // display: 'grid',  stated in css
        //display: '-ms-grid',
        verticalAlign: 'middle',
        gridTemplateColumns: gridAutoColumns,
        msGridColumns: msGridAutoColumns,
      }} >
        {items.map(item => {
          const style: React.CSSProperties = {
            msGridColumns: gridColumn,
            msGridRows: gridRow
          }
          gridColumn++;
          if (gridColumn > repeat) {
            gridColumn = 1;
            gridRow++;
          }
          return <div key={uniqueId()} style={style}>{item}</div>;
        })}
      </div>
    )
  }
}

let idSeq = 0;
const uniqueId = () => new Date().getTime().toString() + (++idSeq);
