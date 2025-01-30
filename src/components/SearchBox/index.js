import {useGetPlacesQuery} from '@/src/store/services/placeApi';
import {isNil, omitBy, trim} from 'lodash';
import React, {useEffect} from 'react';
import {Pressable, StyleSheet, TextInput} from 'react-native';
import {Box} from '../ui/box';
import {Icon, SearchIcon} from '../ui/icon';
import {Modal, ModalBackdrop, ModalBody, ModalContent} from '../ui/modal';
import {Text} from '../ui/text';
import {OptionList} from './OptionList';

export const SearchBox = props => {
  const {placeholder, label, applySelectedOptions, appliedOptions} = props;
  const [open, toggleOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const {data: options} = useGetPlacesQuery(
    omitBy({name: trim(searchText)}, isNil),
  );

  const handleApply = selectedOptions => {
    applySelectedOptions(selectedOptions);
    toggleOpen(false);
  };

  useEffect(() => {
    if (!open) {
      setSearchText('');
    }
  }, [open]);

  return (
    <>
      <Pressable onPress={() => toggleOpen(true)}>
        {label && <Text className="font-medium mb-2">{label}</Text>}
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
          <ModalBody className="h-2/3">
            {label && <Text className="font-medium mb-2">{label}</Text>}
            <Box className="border border-gray-300 rounded-lg flex flex-row justify-between items-center h-12 px-2">
              <TextInput
                placeholder={placeholder}
                style={styles.input}
                // onBlur={onBlur}
                onChangeText={setSearchText}
                value={searchText}
                // textContentType={formField.type}
                placeholderClassName=""
                placeholderTextColor={'black'}
              />
              <Icon as={SearchIcon} />
            </Box>
            <OptionList
              options={options}
              toggleOpen={toggleOpen}
              handleApply={handleApply}
              appliedOptions={appliedOptions}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    width: '90%',
  },
});
