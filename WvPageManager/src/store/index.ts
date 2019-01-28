import { createStore } from 'redux';
import rootReducer from './reducer';
import WvPbStore from '../models/WvPbStore';

const configureStore = (preloadedState: WvPbStore) =>
  createStore(rootReducer, preloadedState);

export { configureStore };