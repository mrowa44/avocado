const path = require('path');

module.exports = {
  DEV_URL: 'http://localhost:3000',
  BUILD_URL: 'file://' + path.join(__dirname, '../build/index.html'), // eslint-disable-line prefer-template

  // tasks
  ADD_TODO: 'ADD_TODO',
  TOGGLE_DONE: 'TOGGLE_DONE',
  FETCHED_TASKS: 'FETCHED_TASKS',
  FETCH_TASKS: 'FETCH_TASKS',

  // pomodoros
  FETCHED_POMODOROS: 'FETCHED_POMODOROS',
  FETCH_POMODOROS: 'FETCH_POMODOROS',
  POMODORO_FINISHED: 'POMODORO_FINISHED',
  POMODORO_START: 'POMODORO_START',
  POMODORO_TIME: 'POMODORO_TIME',
  POMODORO_STOP: 'POMODORO_STOP',

  // collapsing
  COLLAPSE_WINDOW: 'COLLAPSE_WINDOW',
  EXPAND_WINDOW: 'EXPAND_WINDOW',
  EXPANDED_HEIGHT: 600,
  COLLAPSED_HEIGHT: 132,
  WINDOW_WIDTH: 400,
  FETCHED_COLLAPSE: 'FETCHED_COLLAPSE',
  FETCH_COLLAPSE: 'FETCH_COLLAPSE',

  // focus
  COMPLETE_FOCUS_TASK: 'COMPLETE_FOCUS_TASK',
  GIVE_UP_FOCUS: 'GIVE_UP_FOCUS',
  FETCH_FOCUS: 'FETCH_FOCUS',
  FETCHED_FOCUS: 'FETCHED_FOCUS',
  SET_FOCUS: 'SET_FOCUS',

  // settings
  FETCH_DAILY_GOAL: 'FETCH_DAILY_GOAL',
  FETCHED_DAILY_GOAL: 'FETCHED_DAILY_GOAL',
  UPDATE_DAILY_GOAL: 'UPDATE_DAILY_GOAL',
  FETCH_ALWAYS_ON_TOP: 'FETCH_ALWAYS_ON_TOP',
  FETCHED_ALWAYS_ON_TOP: 'FETCHED_ALWAYS_ON_TOP',
  UPDATE_ALWAYS_ON_TOP: 'UPDATE_ALWAYS_ON_TOP',


  INITIAL_TASKS: [
    { text: 'This is a task, try marking it done by clicking the checkbox', done: false, id: 1 },
    { text: 'You can set a task to focus with CMD + F when it\'s highlighted', done: false, id: 2 },
    { text: 'Then start a timer and get to work', done: false, id: 3 },
  ],
};
