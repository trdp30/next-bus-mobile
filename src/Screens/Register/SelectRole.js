import {CircleIcon} from '@/src/components/ui/icon';
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from '@/src/components/ui/radio';
import {VStack} from '@/src/components/ui/vstack';
import {roleList} from '@/src/utils/roles';
import React from 'react';

export default function SelectRole({onChange, onBlur, value, disabled}) {
  return (
    <RadioGroup value={value} onChange={onChange} isDisabled={disabled}>
      <VStack space="2xl">
        {roleList.map(role => (
          <Radio key={role.value} value={role.value} onBlur={onBlur}>
            <RadioIndicator>
              <RadioIcon as={CircleIcon} />
            </RadioIndicator>
            <RadioLabel>{role.label}</RadioLabel>
          </Radio>
        ))}
      </VStack>
    </RadioGroup>
  );
}
