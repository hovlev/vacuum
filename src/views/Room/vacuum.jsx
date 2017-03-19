import actions from '../../actions';

const Vacuum = ({ vacuum, currentRoom }) => {
  if (currentRoom.length) {
  }
  return currentRoom.length ? 
    <div className="vacuum_cleaner" style={{left: (vacuum.position.current.x / currentRoom[0].length) * 100 + '%', top: (vacuum.position.current.y / currentRoom.length) * 100 + '%'}}></div>
  :
    <div>No room loaded</div>
};
export default Vacuum;
