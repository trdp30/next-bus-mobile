import {Text} from '@/src/components/ui/text';
import React, {useMemo} from 'react';

export const ErrorMessage = ({errors, formField}) => {
  const hasError = useMemo(
    () => errors[formField.name],
    [errors, formField.name],
  );

  const errorMessages = useMemo(() => {
    if (hasError) {
      switch (hasError.type) {
        case 'required':
          return 'This field is required';
        case 'minLength':
          return 'This field is too short';
        case 'maxLength':
          return 'This field is too long';
        case 'pattern':
          return 'Invalid format';
        case 'validate':
          return 'Invalid value';
        default:
          return 'Invalid value';
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors, hasError]);

  if (hasError) {
    return <Text className="text-red-500">{errorMessages}</Text>;
  }
  return <></>;
};
