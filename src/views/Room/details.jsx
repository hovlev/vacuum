import actions from '../../actions';
import constants from '../../constants';

const Details = ({ dispatch, vacuum, dirtLeft }) => 
  <div className="game_details">
    <p>Left to suck: {dirtLeft}</p>
    <p>Vacuum position: x: {vacuum.position.current.x} y: {vacuum.position.current.y}</p>
    <p><a href="#" onClick={() => {dispatch({ type: actions.RANDOM_ROOM })}}>Create random room</a></p>
  </div>;

export default Details;
