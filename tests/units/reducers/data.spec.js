import test from 'tape';
import data from '../../../src/reducers/data';
import actions from '../../../src/actions';

test('reducers/data - initial state', t => {
  t.plan(2);
  const outcome = data(undefined, {});
  t.equal(typeof outcome, 'object');
  t.deepEqual(outcome, {
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
  });
});
