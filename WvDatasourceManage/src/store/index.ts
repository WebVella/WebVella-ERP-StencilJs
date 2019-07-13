import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducer';
import WvDsManageStore from '../models/WvDsManageStore';
import thunk from 'redux-thunk';

const configureStore = (preloadedState: WvDsManageStore) =>
  createStore(rootReducer, preloadedState, applyMiddleware(thunk));

export { configureStore };