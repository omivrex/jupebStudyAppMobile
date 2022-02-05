import { createStackNavigator } from 'react-navigation-stack';

import RateProg from '../screens/RateProg';

export const rateProg = createStackNavigator(
    {
        RateProg: {
            screen: RateProg,
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