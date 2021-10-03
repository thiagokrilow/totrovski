import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';

import AuthScreen from './src/screens/Auth/Auth';
import SharePlaceScreen from './src/screens/SharePlace/SharePlace';
import FindPlaceScreen from './src/screens/FindPlace/FindPlace';
import PlaceDetailScreen from './src/screens/PlaceDetail/PlaceDetail';
import SideDrawer from './src/screens/SideDrawer/SideDrawer';

import configureStore from './src/store/configureStore';

const store = configureStore();

// Register Screens
Navigation.registerComponent(
    'place-finder.AuthScreen',
    () => AuthScreen,
    store,
    Provider
);
Navigation.registerComponent(
    'place-finder.SharePlaceScreen',
    () => SharePlaceScreen,
    store,
    Provider
);
Navigation.registerComponent(
    'place-finder.FindPlaceScreen',
    () => FindPlaceScreen,
    store,
    Provider
);
Navigation.registerComponent(
    'place-finder.PlaceDetailScreen',
    () => PlaceDetailScreen,
    store,
    Provider
);
Navigation.registerComponent(
    'place-finder.SideDrawer',
    () => SideDrawer,
    store,
    Provider
);

// Start a App
export default () =>
    Navigation.startSingleScreenApp({
        screen: {
            screen: 'place-finder.AuthScreen',
            title: 'Login'
        }
    });
