import { createStackNavigator } from 'react-navigation-stack';

import Register from '../screens/payment';

export const regStack = createStackNavigator(
    {
        Register: {
            screen: Register,
            navigationOptions: {
                title: 'Register',
            }
        }
    },
  
  {
    defaultNavigationOptions: {
      headerShown: false,
      headerStyle: {
        backgroundColor: '#9c27b0',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        textAlign: 'center',
        // justifyContent: 'center',
        fontSize: 30,
      }
    }
  }
)

