import { connect } from 'react-redux';
import actions from '../../actions';
import constants from '../../constants';
import Vacuum from './vacuum';
import Details from './details';
import Table from './table';

const calculateWidth = currentRoom => 
  currentRoom.length ? currentRoom[0].length * constants.dimensions.cell : constants.dimensions.cell;

const calculateTime = (lastMoveTime, startTime) =>
  (lastMoveTime - startTime) / 1000;

const Room = ({ dispatch, currentRoom, dirtLeft, startTime, lastMoveTime, vacuum }) =>
  <div>
    <Details dispatch={dispatch} vacuum={vacuum} dirtLeft={dirtLeft} />
    <div className="room" style={{width: calculateWidth(currentRoom)}}>
      <Vacuum vacuum={vacuum} currentRoom={currentRoom} />
      {!dirtLeft && currentRoom.length ? 
        <div className="won" onClick={() => { dispatch({ type: actions.RESET_BOARD })}}>
          <p>You won in {calculateTime(lastMoveTime, startTime)} seconds! Reset?</p>
        </div> 
        : ''}
      <Table currentRoom={currentRoom} />
    </div>
  </div>;

export default connect(state => ({
  vacuum: state.data.vacuum,
  currentRoom: state.data.currentRoom,
  dirtLeft: state.data.dirtLeft,
  lastMoveTime: state.data.lastMoveTime,
  startTime: state.data.startTime
}))(Room);
