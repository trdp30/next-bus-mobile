import {Box} from '@/src/components/ui/box';
import {CheckIcon, CloseIcon, Icon} from '@/src/components/ui/icon';
import {Spinner} from '@/src/components/ui/spinner';
import {Text} from '@/src/components/ui/text';
import {PermissionContext} from '@/src/contexts/PermissionContext';
import classname from 'classname';
import React, {useContext, useEffect} from 'react';
import {ScrollView, useColorScheme} from 'react-native';
import {openSettings} from 'react-native-permissions';

const CollectPermission = () => {
  const {
    state,
    startRequestingPermission,
    isRequesting,
    requestError,
    hasMissingPermissions,
  } = useContext(PermissionContext);
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    startRequestingPermission();
  }, [startRequestingPermission]);

  const handleOpenSettings = () => {
    openSettings(
      hasMissingPermissions === 'background_location'
        ? 'location'
        : 'notification',
    );
  };

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
        <ScrollView>
          <Box className="bg-white p-6 rounded-md shadow-md">
            {Object.keys(state).map(key => {
              const item = state[key];
              return (
                <Box className="flex" key={key}>
                  <Box className="flex justify-start flex-row">
                    {item.granted ? (
                      <Icon
                        as={CheckIcon}
                        className="text-green-500 mr-5 top-1"
                      />
                    ) : (
                      <>
                        {isRequesting ? (
                          <Spinner size="14" className="mr-6" />
                        ) : (
                          <Icon
                            as={CloseIcon}
                            className="text-red-500 mr-5 top-1"
                          />
                        )}
                      </>
                    )}
                    <Text className="text-md font-bold text-left">
                      {item.name}
                    </Text>
                  </Box>
                  <Text className="font-normal ml-10">{item.description}</Text>
                  <Text className="font-normal ml-10 text-red-500">
                    {item?.error}
                  </Text>
                </Box>
              );
            })}
            {requestError ? (
              <Box className="py-6">
                <Box>
                  <Text className="font-medium">
                    Requesting Permission failed with the below mentioned error:
                  </Text>
                </Box>
                <Box className="p-2 bg-gray-200 rounded">
                  <Text className="text-md text-left text-red-500">
                    {requestError}
                  </Text>
                </Box>
              </Box>
            ) : (
              <></>
            )}
            {hasMissingPermissions ? (
              <Box className="flex justify-center">
                <Box className="mt-4">
                  <Text className="text-center">
                    Fix the permission error from the setting. Once done, click
                    the retry.
                  </Text>
                  <Text
                    className="text-blue-500 text-md underline text-center"
                    onPress={handleOpenSettings}>
                    Open Settings
                  </Text>
                  <Text
                    className="text-blue-500 text-md underline text-center"
                    onPress={startRequestingPermission}>
                    Retry
                  </Text>
                </Box>
              </Box>
            ) : (
              <></>
            )}
          </Box>
        </ScrollView>
      </Box>
    </Box>
  );
};

export default CollectPermission;
