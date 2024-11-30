import {Heading} from '@/src/components/ui/heading';
import {HStack} from '@/src/components/ui/hstack';
import {Pressable} from '@/src/components/ui/pressable';
import {Text} from '@/src/components/ui/text';
import {VStack} from '@/src/components/ui/vstack';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

export const SupportSection = () => {
  const navigation = useNavigation();
  const handlePress = screen => {
    navigation.navigate(screen);
  };
  return (
    <VStack space="lg">
      <Heading className="mb-1">Support</Heading>
      <Pressable onPress={() => handlePress('GetHelp')}>
        <HStack className="justify-between">
          <HStack space="md" className="items-center">
            <Icon name="help" size={16} />
            <Text>Get Help</Text>
          </HStack>
          <Icon name={'chevron-forward'} />
        </HStack>
      </Pressable>
      <Pressable onPress={() => handlePress('ContactSupport')}>
        <HStack className="justify-between">
          <HStack space="md" className="items-center">
            <Icon name={'headset-outline'} size={16} />
            <Text>Contact Support</Text>
          </HStack>
          <Icon name={'chevron-forward'} />
        </HStack>
      </Pressable>
    </VStack>
  );
};

export default SupportSection;
