import {roleList} from '@/src/utils/roles';
import {produce} from 'immer';

export const initialState = {
  name: '',
  registration_number: '',
  phone: '',
  // chassis_number: '',
  // engine_number: '',
  role: '',
  isPublicTransport: false,
  isVehicleCommercialRegistered: false,
};

export const reducer = (state, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case 'SET_NAME':
        draft.name = action.payload;
        break;
      case 'SET_REGISTRATION_NUMBER':
        draft.registration_number = action.payload;
        break;
      // case 'SET_CHASSIS_NUMBER':
      //   draft.chassis_number = action.payload;
      //   break;
      // case 'SET_ENGINE_NUMBER':
      //   draft.engine_number = action.payload;
      //   break;
      case 'SET_ROLE':
        draft.role = action.payload;
        break;
      case 'SET_IS_PUBLIC_TRANSPORT':
        draft.isPublicTransport = action.payload;
        break;
      case 'SET_IS_VEHICLE_COMMERCIAL_REGISTERED':
        draft.isVehicleCommercialRegistered = action.payload;
        break;
      default:
        break;
    }
  });
};

export const formFields = [
  {
    name: 'name',
    type: 'name',
    keyboardType: 'default',
    label: 'Name',
    placeholder: 'Enter vehicle name',
    required: true,
    disabled: false,
  },
  {
    name: 'registration_number',
    type: 'registration_number',
    keyboardType: 'default',
    label: 'Registration Number',
    placeholder: 'Enter vehicle registration number',
    required: true,
    disabled: false,
  },
  {
    name: 'phone',
    type: 'telephoneNumber',
    keyboardType: 'phone-pad',
    label: 'Enter a vehicle contact number',
    placeholder: 'Enter a vehicle contact number',
    required: true,
    disabled: false,
    maxLength: 10,
    minLength: 10,
  },
  {
    name: 'role',
    type: 'radio',
    keyboardType: 'radio',
    label: 'You want to register the vehicle as a:',
    placeholder: '',
    required: true,
    options: roleList,
  },
  {
    name: 'isPublicTransport',
    type: 'radio',
    keyboardType: 'radio',
    label: 'Is this a public transport vehicle?',
    placeholder: '',
    required: true,
    options: [
      {
        label: 'Yes',
        value: '1',
      },
      {
        label: 'No',
        value: '0',
      },
    ],
  },
  {
    name: 'isVehicleCommercialRegistered',
    type: 'radio',
    keyboardType: 'radio',
    label: 'Is this vehicle commercially registered?',
    placeholder: '',
    required: true,
    options: [
      {
        label: 'Yes',
        value: '1',
      },
      {
        label: 'No',
        value: '0',
      },
    ],
  },
];
