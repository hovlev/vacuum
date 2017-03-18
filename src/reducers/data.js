import { assoc, merge, pipe, nth, prop, update, subtract } from 'ramda';
import actions from '../actions';

const init = {
  currentRoom: [],
  vacuum: {
    position: {
      current: {x: 0, y: 0},
      previous: {x: 0, y: 0}
    },
    totalSucked: 0
  }
};

const getTile = (payload, state) => {
  return pipe(
    prop('currentRoom'),
    nth(payload.y),
    nth(payload.x)
  )(state);
};

const tileSuck = (payload, state) => {
  let tile = getTile(payload, state);
  return tile > 0 ? assoc(
    // name of property to update
    'currentRoom',
    // value to set to above given property
    update(
      payload.y, // update the specific y (row) index with the result of pipe
      pipe(
        prop('currentRoom'),
        nth(payload.y), // nth y (row) of the board
        update(payload.x, subtract(tile, 1)) // update specific x (col) index in the y (row) with the reduced amount of dirt
      )(state),
      prop('currentRoom', state)
    ),
    // object in which to set the above property and value
    state
  ) : state;
};

// { type = 'ADD_TODO', payload = {message: 'shopping', completed: false}}
export default (state = init, action) => {
  
  switch (action.type) {
    case actions.LOADED_BOARD:
      return assoc('currentRoom', action.payload.room, state);

    case actions.TILE_SUCK:
      return tileSuck(action.payload, state);

    case actions.VACUUM_MOVE:
      console.log(action.payload, '<<<<<<<<');
      return state;

    default:
      return state;
  }
};
