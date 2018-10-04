import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import Login from './screens/Login';
import SkateSessions from './screens/SkateSessions';
import SplashScreen from './screens/SplashScreen';
import ViewSession from './screens/ViewSession';

const LoginStack = createStackNavigator({
  Login: { screen: Login },
  Sessions: { screen: SkateSessions },
  Session: { screen: ViewSession }
});

const AuthorisedStack = createStackNavigator({
  Sessions: { screen: SkateSessions },
  Session: { screen: ViewSession },
  Login: { screen: Login }    // Used if the user logs out
});

const App = createSwitchNavigator(
  {
    SplashScreen: SplashScreen,
    Login: LoginStack,
    Auth: AuthorisedStack,
  },
  {
    initialRouteName: 'SplashScreen',
  }
);

export default App;
