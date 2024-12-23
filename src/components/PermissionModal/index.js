import {CheckIcon, CloseIcon, Icon} from '@/src/components/ui/icon';
import {Spinner} from '@/src/components/ui/spinner';
import {Text} from '@/src/components/ui/text';
import {PermissionContext} from '@/src/contexts/PermissionContext';
import React, {useContext, useEffect} from 'react';
import {openSettings} from 'react-native-permissions';
import {Box} from '../ui/box';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '../ui/modal';

export const PermissionModal = () => {
  const {
    state,
    startRequestingPermission,
    isRequesting,
    requestError,
    hasMissingPermissions,
  } = useContext(PermissionContext);

  const handleOpenSettings = () => {
    openSettings(
      hasMissingPermissions === 'background_location'
        ? 'location'
        : 'notification',
    );
  };

  useEffect(() => {
    startRequestingPermission();
  }, [startRequestingPermission]);

  return (
    <Modal
      isOpen={true}
      defaultIsOpen={true}
      closeOnOverlayClick={false}
      isKeyboardDismissable={false}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Text className="text-lg font-bold">Permission Required</Text>
        </ModalHeader>
        <ModalBody>
          <Box className="flex flex-1 flex-col space-y-4 px-8 py-4">
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
