import { createStackNavigator } from 'react-navigation-stack';

import About from '../screens/About';

export const about = createStackNavigator(
    {
        About: {
            screen: About,
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