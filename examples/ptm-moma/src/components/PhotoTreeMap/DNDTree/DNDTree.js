import React, {Component} from 'react';
import './DNDTree.css';

class DNDTree extends Component {
  render() {
    return (
      <div className="Grouping paper">
        <div className="paper--title">Tree</div>
        <div className="paper--body">
          <div className="DNDTree" id="dnd-tree-container"/>
        </div>
      </div>
    )
  }
}

export default DNDTree;