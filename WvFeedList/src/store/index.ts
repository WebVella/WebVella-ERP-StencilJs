import { createStore,applyMiddleware } from 'redux';
import rootReducer from './reducer';
import thunk from 'redux-thunk';

const configureStore = (preloadedState: any) =>
  createStore(rootReducer, preloadedState, applyMiddleware(thunk));

export { configureStore };