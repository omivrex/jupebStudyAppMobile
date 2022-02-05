import { createStackNavigator } from 'react-navigation-stack';

import Help from '../screens/Help';

export const help = createStackNavigator(
    {
        Help: {
            screen: Help,
            navigationOptions: {
                title: 'Rate Progress',
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