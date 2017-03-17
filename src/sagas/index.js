import { call, takeLatest, put } from 'redux-saga/effects';
import actions from '../actions';

const requestBoard = function* () {
  const json = yield call(() => fetch('http://localhost:7007/mock/response.json', {method: 'get'})
    .then(res => res.json()));
  yield put({ type: actions.LOADED_BOARD, payload: json });
};
 
export default function* () {
  yield call(requestBoard);
  yield takeLatest(actions.LOAD_BOARD, function* () {
    yield call(requestBoard);
  });
}
