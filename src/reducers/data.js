import {
  add, append, assoc,
  filter, flatten, keys,
  length, map, max,
  merge, min, nth,
  path, pipe, prop,
  subtract, sum, update,
  times, whereEq
} from 'ramda';
import actions from '../actions';
import constants from '../constants';

const init = {
  currentRoom: [],
  startTime: null,
  lastMoveTime: null,
  vacuum: {
    position: {
      current: { x: 0, y: 0 },
      previous: { x: 0, y: 0 },
      direction: 'down'
    }
  }
};

const getTile = (payload, state) => 
  pipe(
    prop('currentRoom'),
    nth(payload.y),
    nth(payload.x)
  )(state);

const getVacuumPosition = state => path([ 'vacuum', 'position', 'current' ], state);

// fired as the vacuum moves into a tile
const tileSuck = (payload, state) => {
  const tile = getTile(payload, state);
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

// fired as the user uses the keyboard cursors
const vacuumMove = (payload, state) => {
  const current = getVacuumPosition(state);
  // gets the relative position of the next tile
  const positionModifier = constants.modifier[payload];
  // the next object, or the next tile the vacuum is moving into, is used for generating the room's new state
  const next = { 
    x: min(
      max(0, add(prop('x', current), positionModifier.x)), 
      subtract(
        length(nth(0, prop('currentRoom', state))), 1)
      ),
    y: min(
      max(0, add(prop('y', current), positionModifier.y)), 
      subtract(
        length(prop('currentRoom', state)), 1)
      )
  };
  // the room's state after the vacuum has moved into the new tile
  const roomAfterSuck = tileSuck(next, state);
  // how much dirt is left in the room after sucking
  const dirtLeft = returnSum(prop('currentRoom', roomAfterSuck));
  // the vacuum's new position details, including the direction it should be facing (based on the movement direction)
  const newPosition = { previous: current, current: next, direction: getDirection(current, next) };
  return !isNaN(getTile(next, state)) ? merge(state, { // isNaN, if is not a number assume it is a wall
    vacuum: assoc('position', newPosition, prop('vacuum', state)),
    currentRoom: prop('currentRoom', roomAfterSuck),
    dirtLeft: dirtLeft,
    // Note: if there is no dirt left (the game has been won), just return the lastMoveTime rather than creating a new date
    lastMoveTime: dirtLeft ? new Date().getTime() : prop('lastMoveTime', roomAfterSuck)
  }) : state;
};

const vacuumMoveTo = (payload, state) => {
  const direction = getDirection(getVacuumPosition(state), payload);
  return direction ? vacuumMove(direction, state) : state;
};

// runs through the array, turning strings from the JSON object into integers (for tile dirt levels)
const parseRoom = room => map(item => map(tile => parseInt(tile), item), room);

// returns the total value of integers in an multi-dimensional (or any) array
const returnSum = array => sum(filter(n => n, flatten(array)));

// works out the direction the vacuum should be facing based on previous/new position
const getDirection = (current, next) => {
  const difference = {
    x: subtract(prop('x', next), prop('x', current)),
    y: subtract(prop('y', next), prop('y', current))
  };
  return nth(0, keys(filter(modifier => whereEq(difference)(modifier), constants.modifier)));
};

// resets the room based on the room argument
const resetRoom = (room, state) => 
  merge(state, {
    cachedRoom: room,
    currentRoom: room,
    dirtLeft: returnSum(room),
    startTime: new Date().getTime(),
    vacuum: prop('vacuum', init)
  });

// generates a random dirty tile (between 0 and 3, more likely to be 0)
const randomTile = () => Math.max(0, Math.floor(Math.random() * 6) - 3);

// generates a random room full of a mixture of dirty and clean tiles, and a random size, DOES NOT add additional walls (TODO)
const randomRoom = () => {
  const columns = Math.round(Math.random() * 5) + 2;
  const rows = Math.round(Math.random() * 5) + 2;
  const room = times(() => times(
    () => randomTile(), columns
  ), rows);
  return append(times(
    n => Math.min(1, n), columns
  ), room);
};

export default (state = init, action) => {
  
  switch (action.type) {
    case actions.LOADED_ROOM:
      return resetRoom(parseRoom(action.payload.room, state));

    case actions.RESET_ROOM:
      return resetRoom(prop('cachedRoom', state), state);

    case actions.RANDOM_ROOM:
      return resetRoom(parseRoom(randomRoom()), state);

    case actions.TILE_SUCK:
      return tileSuck(action.payload, state);

    // triggered on keyboard cursor input
    case actions.VACUUM_MOVE:
      return vacuumMove(action.payload, state);

    // triggered when 'clicking' a tile above, below, left or right of the vacuum
    case actions.VACUUM_MOVE_TO: 
      return vacuumMoveTo(action.payload, state);

    default:
      return state;
  }
};
