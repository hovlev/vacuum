import { assoc, merge, pipe, nth, prop, update, subtract } from 'ramda';
import actions from '../actions';

const init = {
  currentRoom: []
};

const getTile = (payload, state) => {
  return pipe(
    prop('currentRoom'),
    nth(payload.row),
    nth(payload.col)
  )(state);
};

const tileSuck = (payload, state) => {
  let tile = getTile(payload, state);
  return tile > 0 ? assoc(
    // name of property to update
    'currentRoom',
    // value to set to above given property
    update(
      payload.row, // update the specific row index with the result of pipe
      pipe(
        nth(payload.row), // nth row of the board
        update(payload.col, subtract(tile, 1)) // update specific column index in the row with the reduced amount of dirt
      )(prop('currentRoom', state)),
      prop('currentRoom', state)
    ),
    // object in which to set the above property and value
    state
  ) : state;
}

// { type = 'ADD_TODO', payload = {message: 'shopping', completed: false}}
export default (state = init, action) => {
  
  switch (action.type) {
    case actions.LOADED_BOARD:
      return assoc('currentRoom', action.payload.room, state);

    case actions.TILE_SUCK:
      return tileSuck(action.payload, state);

    default:
      return state;
  }
};
