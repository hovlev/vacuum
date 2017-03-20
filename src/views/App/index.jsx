import { connect } from 'react-redux';
import actions from '../../actions';
import Room from '../Room';
import Details from '../Room/details';

const App = () =>
  <div>
    <Details />
    <Room />
  </div>;

export default App;
