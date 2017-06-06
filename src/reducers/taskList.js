import { ADD_TODO } from '../constants';

const initialState = [
  { text: 'Take out garbage 1', done: false, id: 1 },
  { text: 'Take out garbage 2', done: false, id: 2 },
  { text: 'Take out garbage 3', done: false, id: 3 },
  { text: 'Take out garbage 4', done: false, id: 4 },
  { text: 'Take out garbage 5', done: false, id: 5 },
];

export default(state = initialState, action) => {
  switch (action.type) {
    case ADD_TODO:
      const newId = Math.random() * 10; // advanced programming over here
      return [...state, { id: newId, ...action.item }];
    default:
      return state;
  }
};
