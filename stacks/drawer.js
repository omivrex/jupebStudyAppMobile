import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';
import { createBrowserApp } from "@react-navigation/web";

import { homeStack } from './homeStack';
import { regStack } from './paymentStack';
import { rateProg } from './rateProgStack';
import { startPracStack } from './startPracStack';
import { settings } from './settingsStack';
import { help } from './helpStack';
import { about } from './aboutStack';
import drawerComp  from '../components/drawer.component.js';
import { Platform } from 'react-native-web';


const Menu = createDrawerNavigator({
    Home: {
        screen: homeStack
    },
    Register: {
        screen: regStack
    },

    'Start Practice': {
        screen: startPracStack
    },
    'Rate Progress': {
        screen: rateProg
    },
    Settings: {
        screen: settings
    },
    Help: {
        screen: help
    },
    About: {
        screen: about
    }
}, {
    initialRouteName: 'Home',
    contentComponent: drawerComp
})


export default Platform.OS !== 'web'? createAppContainer(Menu):createBrowserApp(Menu)