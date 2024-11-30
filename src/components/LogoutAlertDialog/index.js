import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '../ui/alert-dialog';
import {Button, ButtonText} from '../ui/button';
import {Heading} from '../ui/heading';
import {Text} from '../ui/text';

const LogoutAlertDialog = ({
  openLogoutAlertDialog,
  setOpenLogoutAlertDialog,
}) => {
  const handleClose = () => {
    setOpenLogoutAlertDialog(false);
  };

  return (
    <AlertDialog isOpen={openLogoutAlertDialog} onClose={handleClose}>
      <AlertDialogBackdrop />
      <AlertDialogContent className="p-4">
        <AlertDialogHeader>
          <Heading>Logout</Heading>
          <AlertDialogCloseButton>
            <Icon name={'close'} />
          </AlertDialogCloseButton>
        </AlertDialogHeader>
        <AlertDialogBody className="" contentContainerClassName="">
          <Text className="mb-6">Are you sure, you want to logout?</Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button variant="outline" action="secondary" onPress={handleClose}>
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button action="negative" onPress={handleClose}>
            <ButtonText className="text-white">Logout</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutAlertDialog;
