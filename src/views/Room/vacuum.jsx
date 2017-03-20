import constants from '../../constants';

const Vacuum = ({ vacuum, currentRoom }) => {
  return currentRoom.length ? 
    <div className="vacuum_cleaner" style={{
      left: (vacuum.position.current.x / currentRoom[0].length) * constants.dimensions.cell + '%', top: (vacuum.position.current.y / currentRoom.length) * constants.dimensions.cell + '%',
      width: constants.dimensions.cell,
      height: constants.dimensions.cell,
      transform: 'rotate(' + constants.rotation[vacuum.position.direction] + 'deg)'
    }}>{vacuum.position.direction}</div>
  :
    <div>No room loaded</div>;
};
export default Vacuum;
