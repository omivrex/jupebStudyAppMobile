import { createStackNavigator } from 'react-navigation-stack';

import HomeScreen from '../screens/homeScreen';
import PqScreen from '../screens/pqScreen';
import NewsScreen from '../screens/newsScreen';
import payment from '../screens/payment';

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

  PaymentScreen: {
    screen: payment,
    navigationOptions: {
      title: 'PAYMENT',
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
