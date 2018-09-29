import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import Login from './screens/Login';
import SkateSessions from './screens/SkateSessions';
import SplashScreen from './screens/SplashScreen'

const LoginStack = createStackNavigator({
  Login: { screen: Login },
  Sessions: { screen: SkateSessions }
});

const AuthorisedStack = createStackNavigator({
  Sessions: { screen: SkateSessions }
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
