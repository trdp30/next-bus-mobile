/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {GluestackUIProvider} from '@/src/components/ui/gluestack-ui-provider';
import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import './global.css';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import BottomTabNavigation from './src/Navigation/BottomTabNavigation';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <GluestackUIProvider mode={isDarkMode ? 'dark' : 'light'}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <BottomTabNavigation />
    </GluestackUIProvider>
  );
}

export default App;
