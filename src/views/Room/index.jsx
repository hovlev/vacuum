import { connect } from 'react-redux';
import actions from '../../actions';

const Room = ({ dispatch, currentRoom }) =>
  <table>
    <tbody>
    {currentRoom.map((row, i) =>
      <tr>
        {row.map((cell, j) => {
            cell = parseInt(cell);
            return <td className={cell !== 0 ? isNaN(cell) ? 'wall' : 'dirt' : ''}>{cell}<span style={{opacity: isNaN(cell) ? 1 : cell / 5}}></span></td>
          }
        )}
      </tr>
    )}
    </tbody>
  </table>;

export default connect(state => ({
  currentRoom: state.data.currentRoom
}))(Room);
