import { createStackNavigator } from 'react-navigation-stack';

import StartPrac from '../screens/StartPrac.js';

export const startPracStack = createStackNavigator(
  {
    StartPrac: {
        screen: StartPrac,
        navigationOptions: {
            title: 'Start Practice',
        }
    },
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
        fontSize: 30,
      }
    }
  }
)