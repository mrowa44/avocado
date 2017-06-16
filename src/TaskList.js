import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import createIpc, { send } from 'redux-electron-ipc';

import { fetchTasks } from './actions/taskList';
import taskListReducer from './reducers/taskList';
import Task from './Task';
import './TaskList.css';

class TaskList extends Component {
  componentDidMount() {
    console.log(this.props);
    this.props.actions.fetchTasks();
  }

  render() {
    return (
      <ul className="task-list list-group">
        { this.props.taskList.map(task => <Task text={task.text} key={task.id} />) }
      </ul>
    );
  }
}

TaskList.propTypes = {
  dispatch: PropTypes.func.isRequired,
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

const ipc = createIpc({
  'fetched-tasks': fetchTasks,
});

const store = createStore(exampleReducer, applyMiddleware(ipc));

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
