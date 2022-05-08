import { createStackNavigator } from 'react-navigation-stack';

import calcScreen from '../screens/calcScreen';

export const calcStack = createStackNavigator(
    {
        calcScreen: {
            screen: calcScreen,
            navigationOptions: {
                title: 'POINT CALCULATOR',
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