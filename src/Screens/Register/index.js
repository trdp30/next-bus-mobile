import {Box} from '@/src/components/ui/box';
import {Button, ButtonText} from '@/src/components/ui/button';
import {Heading} from '@/src/components/ui/heading';
import {Pressable} from '@/src/components/ui/pressable';
import {Text} from '@/src/components/ui/text';
import {VStack} from '@/src/components/ui/vstack';
import {AuthContext} from '@/src/contexts/AuthContext';
import {useRegisterUserMutation} from '@/src/store/services/userApi';
import {roles} from '@/src/utils/roles';
import classNames from 'classnames';
import React, {useContext, useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  useColorScheme,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {ErrorMessage} from './ErrorMessage';
import SelectRole from './SelectRole';
import {formFields, initialState} from './helpers';

export default function Register() {
  const isDarkMode = useColorScheme() === 'dark';
  const {fbUser, signOut, handleSignInWithCustomToken} =
    useContext(AuthContext);
  const [registerUser, result] = useRegisterUserMutation();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: initialState(fbUser),
  });
  const [selectedRole, setSelectedRole] = useState(roles.driver);
  const onSubmit = async data => {
    const payload = {
      ...data,
      role: selectedRole,
    };
    await registerUser(payload);
  };

  useEffect(() => {
    if (result.isSuccess) {
      handleSignInWithCustomToken(result.data.customToken);
    } else if (result.isError) {
      console.log('register user error', result.error);
      // Todo: Handle the error format
    }
  }, [result, handleSignInWithCustomToken]);

  return (
    <>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={isDarkMode ? 'gray' : 'white'}
        />
        <Box
          className={classNames(
            'flex flex-1 justify-center items-center',
            isDarkMode ? 'bg-gray-700' : 'bg-white',
          )}>
          <Box className="absolute z-20 w-full px-4 pt-4 top-0">
            <Pressable onPress={signOut}>
              <Box className="z-20 w-12 rounded-full p-2">
                <Icon name={'arrow-left'} size={28} />
              </Box>
            </Pressable>
          </Box>
          <Box
            className={classNames(
              'absolute h-2/4 w-full top-0 rounded-b-[30%]',
              isDarkMode ? 'bg-white' : 'bg-teal-200',
            )}
          />
          <Heading className="w-full text-3xl text-black text-center">
            Register you account
          </Heading>
          <Text className="mb-4 text-md text-gray-900 text-center w-full px-4">
            Once registered, you can login to the application
          </Text>
          <Box
            className={classNames(
              'rounded-lg border border-background-200 p-5 m-4 bg-white',
              isDarkMode ? 'bg-teal-600' : 'bg-white',
            )}>
            <VStack className="w-full" space="md">
              {formFields.map(formField => (
                <Box key={formField.name} className="mb-4">
                  {formField.type === 'radio' ? (
                    <VStack>
                      <Text className="mb-2">{formField.label}</Text>
                      <Box className="px-2">
                        <SelectRole
                          onChange={setSelectedRole}
                          value={selectedRole}
                          disabled={result.isLoading}
                        />
                      </Box>
                    </VStack>
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
                  <ErrorMessage errors={errors} formField={formField} />
                </Box>
              ))}
              <Button
                onPress={handleSubmit(onSubmit)}
                isDisabled={result.isLoading}>
                <ButtonText>Submit</ButtonText>
              </Button>
            </VStack>
          </Box>
        </Box>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderBottomColor: '#767b82',
    borderBottomWidth: 1,
  },
  contentContainer: {
    flex: 1,
  },
});
