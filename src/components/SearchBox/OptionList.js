import {filter, find, findIndex, map, uniq} from 'lodash';
import React, {useMemo} from 'react';
import {Box} from '../ui/box';
import {Button, ButtonText} from '../ui/button';
import {Option} from './Option';

export const OptionList = props => {
  const {options, toggleOpen, handleApply, appliedOptions} = props;
  const [selectedOptions, setSelectedOptions] = React.useState(
    appliedOptions || [],
  );

  const handleOptionSelect = option => {
    setSelectedOptions(prev => {
      const index = findIndex(prev, v => v?._id === option?._id);
      if (index === -1) {
        const value = prev.concat(option);
        return uniq(value);
      } else {
        const value = prev.filter(v => v?._id !== option?._id);
        return uniq(value);
      }
    });
  };

  const filteredOptions = useMemo(() => {
    return filter(options, option => {
      return !find(selectedOptions, v => v?._id === option?._id);
    });
  }, [options, selectedOptions]);

  return (
    <Box className="">
      <Box className="py-2">
        {map(filteredOptions, option => (
          <Option
            key={option?._id}
            handleOptionSelect={handleOptionSelect}
            selectedOptions={selectedOptions}
            option={option}
          />
        ))}
        {map(selectedOptions, option => (
          <Option
            key={option?._id}
            handleOptionSelect={handleOptionSelect}
            selectedOptions={selectedOptions}
            option={option}
          />
        ))}
      </Box>
      {selectedOptions?.length > 0 ? (
        <Box className="flex flex-row justify-end gap-x-2">
          <Button onPress={() => toggleOpen(false)} variant="outline">
            <ButtonText>Close</ButtonText>
          </Button>
          <Button onPress={() => handleApply(selectedOptions)}>
            <ButtonText>Apply</ButtonText>
          </Button>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};
