import { combineReducers } from 'redux';

import taskList from './taskList';

const rootReducer = combineReducers({
  taskList,
});
export default rootReducer;
