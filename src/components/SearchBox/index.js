import {useGetVehiclesQuery} from '@/src/store/services/vehicleApi';
import React from 'react';
import {Pressable} from 'react-native';
import {Box} from '../ui/box';
import {Icon, SearchIcon} from '../ui/icon';
import {Input, InputField, InputIcon, InputSlot} from '../ui/input';
import {Modal, ModalBackdrop, ModalBody, ModalContent} from '../ui/modal';
import {Text} from '../ui/text';

export const SearchBox = props => {
  const {placeholder} = props;
  const [open, toggleOpen] = React.useState(false);
  const {data: vehicles} = useGetVehiclesQuery();
  console.log('open', open);
  return (
    <>
      <Pressable onPress={() => toggleOpen(true)}>
        <Box className="border border-gray-300 py-3 pl-4 pr-2 rounded-lg flex flex-row">
          <Text className="text-md text-gray-700 flex-1 pr-2">
            {placeholder}
          </Text>
          <Box>
            <Icon as={SearchIcon} />
          </Box>
        </Box>
      </Pressable>
      <Modal
        isOpen={open}
        closeOnOverlayClick={true}
        onClose={() => toggleOpen(false)}
        isKeyboardDismissable={true}>
        <ModalBackdrop />
        <ModalContent>
          {/* <ModalHeader>
          <Text className="text-lg font-bold">Permission Required</Text>
        </ModalHeader> */}
          <ModalBody className="border border-gray-300 rounded-lg h-2/3">
            <Box className="h-full bg-red-300">
              <Input>
                <InputField />
                <InputSlot>
                  <InputIcon>
                    <Icon as={SearchIcon} />
                  </InputIcon>
                </InputSlot>
              </Input>
            </Box>
            {}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
