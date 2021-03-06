import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
  StackCardStyleInterpolator,
} from '@react-navigation/stack';

import ExportCodeInput from './Export/ExportCodeInput';
import ExportComplete from './Export/ExportComplete';
import ExportConfirmUpload from './Export/ExportConfirmUpload';
import ExportIntro from './Export/ExportIntro';
import ExportLocationConsent from './Export/ExportLocationConsent';
import ExportPublishConsent from './Export/ExportPublishConsent';
import ExportSelectHA from './Export/ExportSelectHA';

import { Screens } from '../navigation';

const Stack = createStackNavigator();

const fade: StackCardStyleInterpolator = ({ current }) => ({
  cardStyle: { opacity: current.progress },
});

const SCREEN_OPTIONS = {
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  cardStyle: {
    backgroundColor: 'transparent', // prevent white flash on Android
  },
  headerShown: false,
};

const ExportStack = (): JSX.Element => (
  <Stack.Navigator
    mode='modal'
    screenOptions={{
      ...SCREEN_OPTIONS,
      cardStyleInterpolator: fade,
      gestureEnabled: false,
    }}
    initialRouteName={Screens.ExportSelectHA}>
    <Stack.Screen name={Screens.ExportIntro} component={ExportIntro} />
    <Stack.Screen name={Screens.ExportSelectHA} component={ExportSelectHA} />
    <Stack.Screen name={Screens.ExportCodeInput} component={ExportCodeInput} />
    <Stack.Screen
      name={Screens.ExportLocationConsent}
      component={ExportLocationConsent}
    />
    <Stack.Screen
      name={Screens.ExportPublishConsent}
      component={ExportPublishConsent}
    />
    <Stack.Screen
      name={Screens.ExportConfirmUpload}
      component={ExportConfirmUpload}
    />
    <Stack.Screen name={Screens.ExportDone} component={ExportCodeInput} />
    <Stack.Screen name={Screens.ExportComplete} component={ExportComplete} />
  </Stack.Navigator>
);

export default ExportStack;
