import { assoc, merge } from 'ramda';
import actions from '../actions';

const init = {
  currentRoom: []
};

// { type = 'ADD_TODO', payload = {message: 'shopping', completed: false}}
export default (state = init, action) => {
  
  switch (action.type) {
    case actions.LOADED_BOARD:
      return assoc('currentRoom', action.payload.room, state);

    default:
      return state;
  }
};
