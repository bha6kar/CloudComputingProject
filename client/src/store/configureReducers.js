import { combineReducers } from 'redux';
import login from '../views/reducer';
import { reducer as form } from 'redux-form';

export default combineReducers({
 login,
 form
});