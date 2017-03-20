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
      current: {x: 0, y: 0},
      previous: {x: 0, y: 0},
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

const vacuumMove = (payload, state) => {
  let current = path(['vacuum', 'position', 'current'], state);
  let positionModifier = constants.modifier[payload]
  let next = { 
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
  let roomAfterSuck = tileSuck(next, state);
  let dirtLeft = returnSum(prop('currentRoom', roomAfterSuck));
  let newPosition = { previous: current, current: next, direction: getDirection(current, next) };
  return !isNaN(getTile(next, state)) ? merge(state, {
    vacuum: assoc('position', newPosition, prop('vacuum', state)),
    currentRoom: prop('currentRoom', roomAfterSuck),
    dirtLeft: dirtLeft,
    lastMoveTime: dirtLeft ? new Date().getTime() : prop('lastMoveTime', roomAfterSuck) // if there is no dirt left (the game has been won), just return the lastMoveTime rather than creating a new date
  }) : state;
};

const parseRoom = room => map(item => map(tile => parseInt(tile), item), room);
const returnSum = array => sum(filter(n => n, flatten(array)));

const getDirection = (current, next) => {
  let difference = {
    x: subtract(prop('x', next), prop('x', current)),
    y: subtract(prop('y', next), prop('y', current))
  };
  return nth(0, keys(filter(modifier => whereEq(difference)(modifier), constants.modifier)));
};

const resetRoom = (room, state) => 
  merge(state, {
    cachedRoom: room,
    currentRoom: room,
    dirtLeft: returnSum(room),
    startTime: new Date().getTime(),
    vacuum: prop('vacuum', init)
  });

const randomTile = () => Math.max(0, Math.floor(Math.random() * 6) - 3);

const randomRoom = () => {
  let columns = Math.round(Math.random() * 5) + 2;
  let rows = Math.round(Math.random() * 5) + 2;
  let room = times(() => times(
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

    case actions.VACUUM_MOVE:
      return vacuumMove(action.payload, state);

    default:
      return state;
  }
};
