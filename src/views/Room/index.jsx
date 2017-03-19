import { connect } from 'react-redux';
import actions from '../../actions';
import constants from '../../constants';
import Vacuum from './vacuum';

const Room = ({ dispatch, currentRoom, dirtLeft, startTime, lastMoveTime, vacuum }) =>
  <div>
    <div className="game_details"><p>Left to suck: {dirtLeft}</p></div>
    <div className="room" style={{width: currentRoom.length ? currentRoom[0].length * constants.dimensions.cell : constants.dimensions.cell}}>
      <Vacuum vacuum={vacuum} currentRoom={currentRoom} />
      {!dirtLeft && currentRoom.length ? <div className="won" onClick={() => { dispatch({ type: actions.LOAD_BOARD })}}><p>You won in {(lastMoveTime - startTime) / 1000} seconds! Reset?</p></div> : ''}
      <table>
        <tbody>
        {currentRoom.map((row, i) =>
          <tr key={i}>
            {row.map((cell, j) => <td 
              key={j} 
              className={cell !== 0 ? isNaN(cell) ? 'wall' : 'dirt' : ''}>
                <span style={{opacity: isNaN(cell) ? 1 : cell / 5}}></span>
              </td>
            )}
          </tr>
        )}
        </tbody>
      </table>
    </div>
  </div>;

export default connect(state => ({
  vacuum: state.data.vacuum,
  currentRoom: state.data.currentRoom,
  dirtLeft: state.data.dirtLeft,
  lastMoveTime: state.data.lastMoveTime,
  startTime: state.data.startTime
}))(Room);
