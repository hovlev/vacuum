import actions from '../../actions';
import constants from '../../constants';

const Vacuum = ({ vacuum, currentRoom }) => {
  if (currentRoom.length) {
  }
  return currentRoom.length ? 
    <div className="vacuum_cleaner" style={{
      left: (vacuum.position.current.x / currentRoom[0].length) * 100 + '%', top: (vacuum.position.current.y / currentRoom.length) * 100 + '%',
      width: constants.dimensions.cell,
      height: constants.dimensions.cell
    }}></div>
  :
    <div>No room loaded</div>
};
export default Vacuum;
