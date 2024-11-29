import {OverlayProvider} from '@gluestack-ui/overlay';
import {ToastProvider} from '@gluestack-ui/toast';
import {colorScheme as colorSchemeNW} from 'nativewind';
import React from 'react';
import {useColorScheme, View} from 'react-native';
import {config} from './config';

const getColorSchemeName = (colorScheme, mode) => {
  if (mode === 'system') {
    return colorScheme ?? 'light';
  }
  return mode;
};

export function GluestackUIProvider({mode = 'light', ...props}) {
  const colorScheme = useColorScheme();

  const colorSchemeName = getColorSchemeName(colorScheme, mode);

  colorSchemeNW.set(mode);

  return (
    <View
      style={[
        config[colorSchemeName],
        {flex: 1, height: '100%', width: '100%'},
        props.style,
      ]}>
      <OverlayProvider>
        <ToastProvider>{props.children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}
