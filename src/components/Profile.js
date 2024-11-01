import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

const Profile = () => {
  const user = {
    name: 'Test user',
    email: 'test@gmail.com',
  };
  return (
    <View style={styles.container}>
      {/* <Image style={styles.avatar} source={{ uri: user.avatarUrl }} /> */}
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
      {/* Add more details as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: 'gray',
  },
});

export default Profile;
