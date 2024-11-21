import {map} from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import {Text} from 'react-native';
import {Box} from '../components/ui/box';
import {Button, ButtonText} from '../components/ui/button';
import {HStack} from '../components/ui/hstack';
import {ChevronDownIcon} from '../components/ui/icon';
import {Input, InputField} from '../components/ui/input';
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
} from '../components/ui/select';
import {VStack} from '../components/ui/vstack';
import {AuthContext} from '../contexts/AuthContext';
import {getCurrentRole, roleList} from '../utils/roles';

export default function Register() {
  const {user} = useContext(AuthContext);
  console.log('user', user);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [role, setRole] = useState(getCurrentRole(user));
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPhone(user?.phone || '');
    setRole(getCurrentRole(user));
  }, [user]);

  // const pickImage = () => {
  //   const options = {
  //     mediaType: 'photo',
  //     includeBase64: false,
  //     maxHeight: 2000,
  //     maxWidth: 2000,
  //   };

  //   launchImageLibrary(options, response => {
  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.error) {
  //       console.log('ImagePicker Error: ', response.error);
  //     } else if (response.assets && response.assets.length > 0) {
  //       const source = {uri: response.assets[0].uri};
  //       setProfileImage(source);
  //     }
  //   });
  // };

  const handleSave = () => {
    // Implement your save logic here
    console.log('Profile saved:', {name, email, role, profileImage});
    setIsEditing(false);
  };

  return (
    <Box className="flex flex-1 bg-white p-10">
      <VStack space="sm">
        {/* <Box className={'flex h-32 w-full flex-1 items-center'}>
          <Button
            onPress={pickImage}
            isDisabled={!isEditing}
            variant="outline"
            className="h-32 w-32 rounded-full">
            {profileImage ? (
              <Image
                source={profileImage}
                alt="Profile"
                size="2xl"
                className="rounded-full"
              />
            ) : (
              <Box className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-200">
                <Text className="font-bold text-gray-500">Add Photo</Text>
              </Box>
            )}
          </Button>
        </Box> */}
        <Text className="font-bold">Name</Text>
        <Input
          variant="outline"
          size="md"
          isDisabled={false}
          isInvalid={false}
          isReadOnly={false}>
          <InputField value={name} placeholder="Enter your name..." />
        </Input>

        <Text className="font-bold">Email</Text>
        <Input
          variant="outline"
          size="md"
          isDisabled={false}
          isInvalid={false}
          isReadOnly={false}>
          <InputField value={email} placeholder="Enter your email..." />
        </Input>

        <Text className="font-bold">Phone Number:</Text>
        <Input
          variant="outline"
          size="md"
          isDisabled={false}
          isInvalid={false}
          isReadOnly={false}>
          <InputField value={phone} placeholder="Enter your phone number..." />
        </Input>

        <Text className="font-bold">Registering yourself as:</Text>
        <Select onValueChange={e => setRole(e)}>
          <SelectTrigger variant="outline" size="lg">
            <SelectInput placeholder="Select destination location" />
            <SelectIcon className="mr-3" as={ChevronDownIcon} />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              {map(roleList, rl => (
                <SelectItem key={rl.value} label={rl.label} value={rl.value} />
              ))}
            </SelectContent>
          </SelectPortal>
        </Select>

        <HStack space="md" className="mt-4">
          {/* <Button
              flex={1}
              onPress={() => setIsEditing(!isEditing)}
              variant={isEditing ? 'solid' : 'outline'}
              action={isEditing ? 'negative' : 'primary'}>
              <Button.Text>{isEditing ? 'Cancel' : 'Edit'}</Button.Text>
            </Button> */}
          <Button
            // flex={1}
            className="flex"
            onPress={handleSave}
            isDisabled={!isEditing}
            action="positive">
            <ButtonText>Save</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
