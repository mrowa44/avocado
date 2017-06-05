import React, { Component } from 'react';

import './TaskList.css';

class TaskList extends Component {
  render() {
    return (
      <ul className="task-list list-group">
        <li className="list-group-item">
          <div className="media-body">
            <p>Lorem ipsum dolor sit amet.</p>
          </div>
        </li>
        <li className="list-group-item">
          <div className="media-body">
            <p>Lorem ipsum dolor sit amet.</p>
          </div>
        </li>
      </ul>
    );
  }
}

export default TaskList;
