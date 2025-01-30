import classNames from 'classnames';
import {find} from 'lodash';
import React, {useMemo} from 'react';
import {Pressable} from 'react-native';
import {Box} from '../ui/box';
import {Text} from '../ui/text';

export const Option = props => {
  const {option, handleOptionSelect, selectedOptions} = props;
  const isSelected = useMemo(() => {
    return find(
      selectedOptions,
      selectedOption => selectedOption?._id === option?._id,
    );
  }, [selectedOptions, option]);

  return (
    <Pressable
      onPress={() => handleOptionSelect(option)}
      key={option?._id}
      className={classNames(
        'active:bg-gray-200 rounded',
        isSelected && 'bg-teal-100',
      )}>
      <Box className="border-b border-b-gray-500 py-3 px-1">
        <Text>{option?.name}</Text>
      </Box>
    </Pressable>
  );
};
