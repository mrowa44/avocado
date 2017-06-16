import {
  ADD_TODO,
  FETCHED_TASKS,
} from '../constants';

export default function (state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      const newId = Math.random() * 10; // advanced programming over here
      return [...state, { id: newId, ...action.item }];
    case FETCHED_TASKS:
      return [...action.tasks];
    default:
      return state;
  }
}
