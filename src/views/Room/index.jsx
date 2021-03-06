import { connect } from 'react-redux';
import actions from '../../actions';
import constants from '../../constants';
import Vacuum from './vacuum';
import Table from './table';

/* TODO consider if this could be part of state/helper, probably would be better off elsewhere anyway */
const calculateWidth = currentRoom => 
  currentRoom.length ? currentRoom[0].length * constants.dimensions.cell : constants.dimensions.cell;

const calculateTime = (lastMoveTime, startTime) =>
  (lastMoveTime - startTime) / 1000;

const Room = ({ dispatch, currentRoom, dirtLeft, startTime, lastMoveTime, vacuum }) =>
  <div className="room" style={{ width: calculateWidth(currentRoom) }}>
    <Vacuum vacuum={vacuum} currentRoom={currentRoom} />
    {!dirtLeft && currentRoom.length ? 
      <div className="won" onClick={() => dispatch({ type: actions.RESET_ROOM })}>
        <p>You won in {calculateTime(lastMoveTime, startTime)} seconds! Reset?</p>
      </div> 
      : ''}
    <Table dispatch={dispatch} currentRoom={currentRoom} />
  </div>;

export default connect(state => ({
  vacuum: state.data.vacuum,
  currentRoom: state.data.currentRoom,
  dirtLeft: state.data.dirtLeft,
  lastMoveTime: state.data.lastMoveTime,
  startTime: state.data.startTime
}))(Room);
