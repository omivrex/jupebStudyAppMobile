import { createStackNavigator } from 'react-navigation-stack';

import HomeScreen from '../screens/homeScreen';
import PqScreen from '../screens/pqScreen';
import NewsScreen from '../screens/newsScreen';
import CalcScreen from '../screens/calcScreen';

const screens = {
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      title: 'Welcome',
    }
  },

  PqScreen: {
    screen: PqScreen,
    navigationOptions: {
      title: 'Past Questions',
    }
  },

  NewsScreen: {
    screen: NewsScreen,
    navigationOptions: {
      title: "News & Resources",
    }
  },

  CalcScreen: {
    screen: CalcScreen,
    navigationOptions: {
      title: 'Calculate Grade Points',
    }
  },
}

export const homeStack = createStackNavigator(screens, {
  defaultNavigationOptions: {
    headerShown: false,
    headerStyle: {
      backgroundColor: '#9c27b0',
    },
  }
})
