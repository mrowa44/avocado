import {
  ADD_TODO,
  FETCHED_TASKS,
} from '../constants';

const { ipcRenderer: ipc } = window.require('electron');

export const addTask = item => ({
  type: ADD_TODO,
  item,
});

export const fetchTasks = () => {
  ipc.send('fetch-tasks');
  ipc.once('fetched-tasks', (event, tasks) => ({
    type: FETCHED_TASKS,
    tasks,
  }));
};
