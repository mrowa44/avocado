import { createStore } from 'redux';

import rootReducer from './reducers';

export default function (initialState) {
  return createStore(rootReducer, initialState);
}
