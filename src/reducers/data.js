import { assoc, assocPath, merge, pipe, nth, prop, update, subtract, add, min, max, path, length, map, flatten, sum, filter } from 'ramda';
import actions from '../actions';
import constants from '../constants';

const init = {
  currentRoom: [],
  startTime: null,
  lastMoveTime: null,
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
  ) : state
};

const parseRoom = room => map(item => map(tile => parseInt(tile), item), room);
const returnSum = array => sum(filter(n => n, flatten(array)));

export default (state = init, action) => {
  
  switch (action.type) {
    case actions.LOADED_BOARD:
      let room = parseRoom(action.payload.room);
      return merge(state, {
        cachedRoom: room,
        currentRoom: room,
        dirtLeft: returnSum(room),
        startTime: new Date().getTime(),
        vacuum: prop('vacuum', init)
      });

    case actions.TILE_SUCK:
      return tileSuck(action.payload, state);

    case actions.VACUUM_MOVE:
      let current = path(['vacuum', 'position', 'current'], state);
      let positionModifier = constants.modifier[action.payload]
      let next = { 
        x: min(max(0, add(prop('x', current), positionModifier.x)), subtract(length(nth(0, prop('currentRoom', state))), 1)),
        y: min(max(0, add(prop('y', current), positionModifier.y)), subtract(length(prop('currentRoom', state)), 1))
      };
      let roomAfterSuck = tileSuck(next, state);
      let dirtLeft = returnSum(prop('currentRoom', roomAfterSuck));
      return !isNaN(getTile(next, state)) ? merge(state, {
        vacuum: assocPath(['position', 'current'], next, prop('vacuum', state)),
        currentRoom: prop('currentRoom', roomAfterSuck),
        dirtLeft: dirtLeft,
        lastMoveTime: dirtLeft ? new Date().getTime() : prop('lastMoveTime', roomAfterSuck) // if there is no dirt left (the game has been won), just return the lastMoveTime rather than creating a new date
      }) : state;

    default:
      return state;
  }
};
