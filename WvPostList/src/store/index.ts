import { createStore } from 'redux';
import rootReducer from './reducer';


const configureStore = (preloadedState: any) =>
  createStore(rootReducer, preloadedState);

export { configureStore };