import constants from '../../constants';

const Vacuum = ({ vacuum, currentRoom }) => {
  return currentRoom.length ? 
    <div className="vacuum_cleaner" style={{
      left: (vacuum.position.current.x / currentRoom[0].length) * 100 + '%', top: (vacuum.position.current.y / currentRoom.length) * 100 + '%',
      width: constants.dimensions.cell,
      height: constants.dimensions.cell,
      transform: "rotate(" + constants.rotation[vacuum.position.direction] + "deg)"
    }}>{vacuum.position.direction}</div>
  :
    <div>No room loaded</div>
};
export default Vacuum;
