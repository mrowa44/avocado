import { ADD_TODO } from '../constants';

const initialState = [
  { text: 'Take out garbage 1', done: false, id: 1 },
  { text: 'Take out garbage 2', done: false, id: 2 },
  { text: 'Take out garbage 3', done: false, id: 3 },
  { text: 'Take out garbage 4', done: false, id: 4 },
  { text: 'Take out garbage 5', done: false, id: 5 },
  { text: 'Take out garbage', done: false, id: 6 },
  { text: 'Take out garbage', done: false, id: 7 },
  { text: 'Take out garbage', done: false, id: 8 },
  { text: 'Take out garbage', done: true, id: 9 },
];

export default(state = initialState, action) => {
  switch (action.type) {
    case ADD_TODO:
      return [...state, action.item];
    default:
      return state;
  }
};
