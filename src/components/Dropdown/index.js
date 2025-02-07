import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from '@/src/components/ui/select';
import {map} from 'lodash';
import React from 'react';
import {Pressable} from 'react-native';
import {Box} from '../ui/box';
import {ChevronDownIcon} from '../ui/icon';
import {Text} from '../ui/text';

export const Dropdown = ({
  isDisabled,
  options,
  selected,
  onSelectedChange,
  placeholder,
  emptyOptionContent,
  isLoading,
}) => {
  return (
    <Select onValueChange={onSelectedChange} isDisabled={isDisabled}>
      <SelectTrigger variant="outline" size="lg" className="flex">
        <SelectInput placeholder={placeholder} className="pr-4 flex flex-1" />
        <SelectIcon className="mr-3" as={ChevronDownIcon} />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          {map(options, option => (
            <SelectItem
              key={option._id}
              label={option.name}
              value={option._id}
            />
          ))}
          <Pressable onPress={() => onSelectedChange('')}>
            <Box className="py-8">
              {isLoading && <Text>Loading</Text>}
              {!isLoading && !options.length ? (
                <>{emptyOptionContent}</>
              ) : (
                <></>
              )}
            </Box>
          </Pressable>
        </SelectContent>
      </SelectPortal>
    </Select>
  );
};
