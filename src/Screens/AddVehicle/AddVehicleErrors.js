import {Text} from '@/src/components/ui/text';
import React from 'react';

export const AddVehicleErrorMessage = ({errors, formField}) => {
  switch (errors[formField.name]?.type) {
    case 'required':
      return <Text className="text-red-500">This field is required</Text>;
    case 'minLength':
      return <Text className="text-red-500">This field is too short</Text>;
    case 'maxLength':
      return <Text className="text-red-500">This field is too long</Text>;
    case 'pattern':
      return <Text className="text-red-500">Invalid format</Text>;
    case 'validate':
      return <Text className="text-red-500">Invalid value</Text>;
    default:
      return <></>;
  }
};
