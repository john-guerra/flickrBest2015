import React, {Component} from 'react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import './Grouping.css';

class Configurations extends Component {

  state = {
    groupingProperties: [],
  };

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const items = reorder(
      this.state.groupingProperties,
      result.source.index,
      result.destination.index
    );

    this.setState({
      groupingProperties: items,
    });
    this.props.update(items);
  }
  componentDidMount = async () => {
    const firstProperties = [
      {name: 'Nationality', fun: d => d.Nationality.split(')')[0].slice(1, d.Nationality.split(')')[0].length)},
      {name: 'Department',},
      {name: 'Classification'},
      {name: 'Gender', fun: d => d.Gender.split(')')[0].slice(1, d.Gender.split(')')[0].length)}
    ];
    this.props.init(firstProperties);
    this.setState({groupingProperties:firstProperties});
  };

  render() {
    return (
      <div className="Grouping paper">
        <div className="paper--title">Group By</div>
        <div className="paper--body">
          <DragDropContext onDragEnd={(event) => this.onDragEnd(event)}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) =>  (
                  <div  className="list" ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
                    {this.state.groupingProperties.map((item, index) => (
                      <Draggable key={index} draggableId={index} index={index}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef}
                               {...provided.draggableProps}
                               {...provided.dragHandleProps}
                               style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                               className="item"
                          >
                            {item.name}
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>
                )
              }
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    )
  }
}

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  background: isDragging ? '#e2e2e2' : '#FAFAFA',
  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? '#FAFAFA' : '#FAFAFA',
});

export default Configurations;