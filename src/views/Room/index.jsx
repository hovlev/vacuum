import { connect } from 'react-redux';
import actions from '../../actions';
import Vacuum from './vacuum';

const Room = ({ dispatch, currentRoom }) =>
  <div>
    <Vacuum />
    <table>
      <tbody>
      {currentRoom.map((row, i) =>
        <tr>
          {row.map((cell, j) => {
              cell = parseInt(cell);
              let cellClass = cell !== 0 ? isNaN(cell) ? 'wall' : 'dirt' : '';
              let opacity = isNaN(cell) ? 1 : cell / 5;
              return <td onClick={() => dispatch({ type: actions.TILE_SUCK, payload: {row: i, col: j} }) } className={cellClass}>{cell}<span style={{opacity: opacity}}></span></td>
            }
          )}
        </tr>
      )}
      </tbody>
    </table>
  </div>;

export default connect(state => ({
  currentRoom: state.data.currentRoom
}))(Room);
