import { ADD_TODO } from '../constants';

export const addTask = item => ({
  type: ADD_TODO,
  item,
});
