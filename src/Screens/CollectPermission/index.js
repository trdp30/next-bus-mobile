import {Box} from '@/src/components/ui/box';
import {CheckIcon, Icon} from '@/src/components/ui/icon';
import {Spinner} from '@/src/components/ui/spinner';
import {Text} from '@/src/components/ui/text';
import classname from 'classname';
import {produce} from 'immer';
import React, {useReducer} from 'react';
import {useColorScheme} from 'react-native';

const initialState = {
  notification: {
    granted: false,
    name: 'Notification',
    description: 'To notify you about the trip status and updates.',
    error: '',
  },
  location: {
    granted: false,
    name: 'Location',
    description: 'To track your trip and provide you with the best experience.',
    error: '',
  },
  background: {
    granted: false,
    name: 'Background Location',
    description: 'To track your trip even when the app is not in use.',
    error: '',
  },
  foreground: {
    granted: false,
    name: 'Foreground Location',
    description: 'To track your trip when the app is in use.',
    error: '',
  },
};

const reducer = (state, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case 'NOTIFICATION':
        draft.notification = action.payload;
        break;
      case 'LOCATION':
        draft.driver = action.payload;
        break;
      case 'BACKGROUND_LOCATION':
        draft.started_from = action.payload;
        break;
      case 'FOREGROUND_LOCATION':
        draft.destination = action.payload;
        break;
      default:
        break;
    }
  });
};

const CollectPermission = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Box className="flex flex-1 items-center">
      <Box
        className={classname(
          'absolute h-2/6 w-full top-0 rounded-b-[50%] shadow-md',
          isDarkMode ? 'bg-white' : 'bg-teal-200',
        )}
      />
      <Box className="flex h-[35%] flex-col py-14 justify-end">
        <Text className="text-4xl font-bold text-center">
          Collecting Permission
        </Text>
        <Box>
          <Text className="text-md text-center px-10">
            Please wait while we collect your device permissions to start the
            trip.
          </Text>
        </Box>
      </Box>
      <Box className="flex flex-1 flex-col space-y-4 px-8 py-4">
        <Box className="bg-white p-6 rounded-md shadow-md">
          {Object.keys(state).map(key => {
            const item = state[key];
            return (
              <Box className="flex">
                <Box className="flex justify-start flex-row">
                  {item.granted ? (
                    <Icon
                      as={CheckIcon}
                      className="text-green-500 m-2 w-4 h-4"
                    />
                  ) : (
                    <Spinner size="14" className="mr-6" />
                  )}
                  <Text className="text-md font-bold text-left">
                    {item.name}
                  </Text>
                </Box>
                <Text className="font-normal ml-10">{item.description}</Text>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default CollectPermission;
