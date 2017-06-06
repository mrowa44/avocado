import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Task from './Task';
import * as taskListActions from './actions/taskList';
import './TaskList.css';

class TaskList extends Component {
  render() {
    return (
      <ul className="task-list list-group">
        { this.props.taskList.map(task => <Task text={task.text} key={task.id} />) }
      </ul>
    );
  }
}

TaskList.propTypes = {
  taskList: PropTypes.arrayOf(PropTypes.object).isRequired,
};

function mapStateToProps(state) {
  return {
    taskList: state.taskList,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(taskListActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
