import React, { Component } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import {
  FETCHED_TASKS,
  FETCH_TASKS,
} from '../constants';

const { ipcRenderer: ipc } = window.require('electron');

function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

function DragAndDrop(PassedComponent) {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        tasks: [],
      };
      this.onDragEnd = this.onDragEnd.bind(this);
    }

    componentWillMount() {
      ipc.send(FETCH_TASKS);
      ipc.on(FETCHED_TASKS, (event, tasks) => {
        this.setState({ tasks });
      });
    }

    componentWillUnmount() {
      ipc.removeAllListeners(FETCHED_TASKS);
    }

    onDragEnd(result) {
      if (!result.destination) { return; }

      const tasks = reorder(
        this.state.tasks,
        result.source.index,
        result.destination.index,
      );

      this.setState({ tasks });
    }

    render() {
      return (
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {provided => (
              <div ref={provided.innerRef}>
                <PassedComponent tasks={this.state.tasks} {...this.props} />
              </div>
            )}
          </Droppable>
        </DragDropContext>
      );
    }
  };
}

export default DragAndDrop;
