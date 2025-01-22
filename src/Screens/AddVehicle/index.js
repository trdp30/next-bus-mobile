import CustomRadio from '@/src/components/Radio';
import {Box} from '@/src/components/ui/box';
import {Button, ButtonText} from '@/src/components/ui/button';
import {Heading} from '@/src/components/ui/heading';
import {Text} from '@/src/components/ui/text';
import {VStack} from '@/src/components/ui/vstack';
import {AuthContext} from '@/src/contexts/AuthContext';
import {useCreateVehicleMutation} from '@/src/store/services/vehicleApi';
import {catchError} from '@/src/utils/catchError';
import {roles} from '@/src/utils/roles';
import {useNavigation} from '@react-navigation/native';
import classNames from 'classnames';
import {trim} from 'lodash';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {AddVehicleErrorMessage} from './AddVehicleErrors';
import {formFields, initialState} from './helper';

const AddVehicle = () => {
  const navigation = useNavigation();
  const {user} = useContext(AuthContext);
  const [selectedRole, setSelectedRole] = React.useState(roles.driver);
  const [isPublicTransport, setIsPublicTransport] = React.useState('1');
  const [isVehicleCommercialRegistered, setIsVehicleCommercialRegistered] =
    React.useState('1');
  const [error, setError] = useState('');
  const [createVehicle, result] = useCreateVehicleMutation();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: initialState,
  });

  const onSubmit = async data => {
    if (selectedRole === roles.owner) {
      data.owner = user?._id;
    }
    const payload = {
      ...data,
      is_public_transport: !!Number(isPublicTransport),
      is_commercial_registered: !!Number(isVehicleCommercialRegistered),
    };
    if (
      trim(payload.name) === '' ||
      trim(payload.registration_number) === '' ||
      trim(payload.phone) === ''
    ) {
      setError('Name, Registration number and Phone fields are required');
      return;
    }
    setError('');
    await createVehicle(payload);
  };

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  useEffect(() => {
    if (result.isError) {
      setError(result.error?.data?.message);
      catchError(result.error, true);
    }
  }, [result.isError, result.error]);

  useEffect(() => {
    if (result.isSuccess) {
      Alert.alert('Success', 'Vehicle added successfully', [
        {
          text: 'Continue',
          onPress: () => navigation.goBack(),
          isPreferred: true,
          style: 'default',
        },
      ]);
    }
  }, [result.isSuccess, navigation]);

  return (
    <Box className="flex flex-1 flex-col">
      <StatusBar barStyle="dark-content" backgroundColor={'gray'} />
      <Box className={classNames('flex flex-1 bg-white flex-col')}>
        <Box className="absolute z-20 w-full px-4 pt-4 top-0">
          <Pressable onPress={handleBack}>
            <Box className="z-20 w-12 rounded-full p-2">
              <FeatherIcon name={'arrow-left'} size={28} />
            </Box>
          </Pressable>
        </Box>
        <Box
          className={classNames(
            'absolute h-2/4 w-full top-0 rounded-b-[30%] bg-teal-200',
          )}
        />
        <Box className="flex h-24 justify-center">
          <Heading className="w-full text-3xl text-black text-center">
            Register Vehicle
          </Heading>
        </Box>
        <Box
          className={classNames(
            'flex flex-1 flex-col rounded-lg border border-background-200 p-5 m-4 bg-white min-h-0',
          )}>
          <ScrollView>
            {formFields.map(formField => (
              <Box key={formField.name} className="my-4">
                {formField.type === 'radio' ? (
                  <>
                    {formField.name === 'role' && (
                      <VStack>
                        <Text className="mb-2">{formField.label}</Text>
                        <Box className="px-2">
                          <CustomRadio
                            onChange={setSelectedRole}
                            value={selectedRole}
                            options={formField.options}
                            disabled={result.isLoading}
                          />
                        </Box>
                      </VStack>
                    )}
                    {formField.name === 'isPublicTransport' && (
                      <VStack>
                        <Text className="mb-2">{formField.label}</Text>
                        <Box className="px-2">
                          <CustomRadio
                            onChange={setIsPublicTransport}
                            value={isPublicTransport}
                            options={formField.options}
                            disabled={result.isLoading}
                          />
                        </Box>
                      </VStack>
                    )}
                    {formField.name === 'isVehicleCommercialRegistered' && (
                      <VStack>
                        <Text className="mb-2">{formField.label}</Text>
                        <Box className="px-2">
                          <CustomRadio
                            onChange={setIsVehicleCommercialRegistered}
                            value={isVehicleCommercialRegistered}
                            options={formField.options}
                            disabled={result.isLoading}
                          />
                        </Box>
                      </VStack>
                    )}
                  </>
                ) : (
                  <Controller
                    control={control}
                    rules={{
                      required: formField.required,
                      maxLength: formField.maxLength,
                      minLength: formField.minLength,
                    }}
                    disabled={result.isLoading}
                    render={({field: {onChange, onBlur, value}}) => (
                      <TextInput
                        placeholder={formField.placeholder}
                        style={styles.textInput}
                        keyboardType={formField.keyboardType}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        textContentType={formField.type}
                        placeholderTextColor={'black'}
                      />
                    )}
                    name={formField.name}
                  />
                )}
                <AddVehicleErrorMessage errors={errors} formField={formField} />
              </Box>
            ))}
          </ScrollView>
          <Box className="border-t border-gray-400 gap-y-2 pt-4">
            {trim(error)?.length ? (
              <Text className="text-red-500 my-2">{error}</Text>
            ) : (
              <></>
            )}
            <Button
              onPress={handleSubmit(onSubmit)}
              disabled={result.isLoading}>
              <ButtonText>Submit</ButtonText>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  textInput: {
    borderBottomColor: '#767b82',
    borderBottomWidth: 1,
  },
  contentContainer: {
    display: 'flex',
    flex: 1,
    // height: '50vh',
    flexDirection: 'column',
  },
});

export default AddVehicle;
