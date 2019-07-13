import { createStore,applyMiddleware } from 'redux';
import rootReducer from './reducer';
import WvPbStore from '../models/WvPbStore';
import thunk from 'redux-thunk';

const configureStore = (preloadedState: WvPbStore) =>
  createStore(rootReducer, preloadedState, applyMiddleware(thunk));

export { configureStore };