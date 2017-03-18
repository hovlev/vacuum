import { call, takeLatest, put, take, spawn } from 'redux-saga/effects';
import { channel } from 'redux-saga';
import actions from '../actions';
import constants from '../constants';

const keyHandler = (ch) =>
  (e) => {
    let direction = constants.keyCodes[e.keyCode];
    if (direction) ch.put({ type: actions.VACUUM_MOVE, payload: direction });
  };
  
const listenKeydown = function* () {
  const keyChannel = channel();
	window.addEventListener('keydown', keyHandler(keyChannel));
  while (true) {
    const action = yield take(keyChannel);
    yield put(action);
  }
};

const requestBoard = function* () {
  const json = yield call(() => fetch('/mock/response.json', {method: 'get'})
    .then(res => res.json()));
  yield put({ type: actions.LOADED_BOARD, payload: json });
};
 
export default function* () {
  yield spawn(listenKeydown);
  yield call(requestBoard);
  yield takeLatest(actions.LOAD_BOARD, function* () {
    yield call(requestBoard);
  });
}
