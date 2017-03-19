import { connect } from 'react-redux';
import actions from '../../actions';
import constants from '../../constants';
import Vacuum from './vacuum';

const Room = ({ dispatch, currentRoom, vacuum }) =>
  <div className="room" style={{width: currentRoom.length ? currentRoom[0].length * constants.dimensions.cell : 0}}>
    <Vacuum vacuum={vacuum} currentRoom={currentRoom} />
    <table>
      <tbody>
      {currentRoom.map((row, i) =>
        <tr key={i}>
          {row.map((cell, j) => {
            cell = parseInt(cell);
            return <td 
              key={j} 
              className={cell !== 0 ? isNaN(cell) ? 'wall' : 'dirt' : ''}>
                <span style={{opacity: isNaN(cell) ? 1 : cell / 5}}></span>
              </td>
            }
          )}
        </tr>
      )}
      </tbody>
    </table>
  </div>;

export default connect(state => ({
  vacuum: state.data.vacuum,
  currentRoom: state.data.currentRoom
}))(Room);
