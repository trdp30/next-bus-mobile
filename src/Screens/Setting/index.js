import LogoutAlertDialog from '@/src/components/LogoutAlertDialog';
import {Button, ButtonText} from '@/src/components/ui/button';
import {Divider} from '@/src/components/ui/divider';
import {Heading} from '@/src/components/ui/heading';
import {Text} from '@/src/components/ui/text';
import {VStack} from '@/src/components/ui/vstack';
import React from 'react';
import {ScrollView} from 'react-native';
import Config from 'react-native-config';
import ProfileSection from './ProfileSection';
import SupportSection from './SupportSection';

export const Settings = ({isActive}) => {
  const [openLogoutAlertDialog, setOpenLogoutAlertDialog] =
    React.useState(false);

  return (
    <ScrollView>
      <VStack className="px-5 py-4 flex-1" space="lg">
        <Heading className="mb-1">Profile</Heading>
        <ProfileSection />
        <Divider className="my-2" />
        {/* <PersonalInfoSection />
        <Divider className="my-2" />
        <HostingSection />
        <Divider className="my-2" /> */}
        <SupportSection />
        <Divider className="my-2" />
        <Button
          action="secondary"
          variant="outline"
          onPress={() => {
            setOpenLogoutAlertDialog(true);
          }}>
          <ButtonText>Logout</ButtonText>
        </Button>
      </VStack>
      <LogoutAlertDialog
        setOpenLogoutAlertDialog={setOpenLogoutAlertDialog}
        openLogoutAlertDialog={openLogoutAlertDialog}
      />
      <Text className={'text-center text-sm'}>
        App Version: {Config.VERSION}
      </Text>
    </ScrollView>
  );
};

export default Settings;
