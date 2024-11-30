import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '@/src/components/ui/avatar';
import {HStack} from '@/src/components/ui/hstack';
import {Pressable} from '@/src/components/ui/pressable';
import {Text} from '@/src/components/ui/text';
import {VStack} from '@/src/components/ui/vstack';
import {AuthContext} from '@/src/contexts/AuthContext';
import {useNavigation} from '@react-navigation/native';
import React, {useContext} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

const ProfileSection = () => {
  const {user} = useContext(AuthContext);
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate('Profile');
  };
  return (
    <Pressable onPress={handlePress}>
      <HStack className="justify-between items-center">
        <HStack space="md">
          <Avatar className="bg-primary-500">
            <AvatarFallbackText>{user?.name}</AvatarFallbackText>
            <AvatarImage
              source={{
                uri: user?.profile_pic,
              }}
            />
          </Avatar>
          <VStack>
            <Text>{user?.name}</Text>
            {/* <Link>
            <LinkText
              size="sm"
              className="text-typography-500 no-underline hover:text-typography-500 active:text-typography-500"
            >
              Show Profile
            </LinkText>
          </Link> */}
          </VStack>
        </HStack>
        <Icon name={'chevron-forward'} />
      </HStack>
    </Pressable>
  );
};

export default ProfileSection;
