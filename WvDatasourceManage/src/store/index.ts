import { createStore } from 'redux';
import rootReducer from './reducer';
import WvDsManageStore from '../models/WvDsManageStore';

const configureStore = (preloadedState: WvDsManageStore) =>
  createStore(rootReducer, preloadedState);

export { configureStore };