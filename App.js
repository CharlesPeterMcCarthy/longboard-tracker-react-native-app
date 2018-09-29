'use strict';

import { createStackNavigator } from 'react-navigation';
import Login from './screens/Login'
import SkateSessions from './screens/SkateSessions';

type Props = {};

const App = createStackNavigator({
  Login: { screen: Login },
  Sessions: { screen: SkateSessions }
});

export default App;
