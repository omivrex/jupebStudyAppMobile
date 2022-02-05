import { createStackNavigator } from 'react-navigation-stack';

import Settings from '../screens/Settings';

export const settings = createStackNavigator(
    {
        Settings: {
            screen: Settings,
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