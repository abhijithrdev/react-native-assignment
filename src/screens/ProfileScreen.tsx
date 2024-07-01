import {Image, StyleSheet, Switch, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {UserProfile} from '../types/UserProfile';

const ProfileScreen = () => {
  const [userData, setUserData] = useState<UserProfile>();
  const [isEnabled, setIsEnabled] = useState(false);

  const getUserSignIn = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_data');
      const userObj = jsonValue != null ? JSON.parse(jsonValue) : null;
      userObj !== undefined ? setUserData(userObj) : null;
    } catch (error) {
      console.error('Error retrieving user sign-in data:', error);
      return null;
    }
  };

  useEffect(() => {
    getUserSignIn();
  }, []);

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{uri: userData?.photoURL}}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.textName}>{userData?.displayName}</Text>
        <Text style={styles.text}>Email: {userData?.email}</Text>
        <Text style={styles.text}>Phone Number: {userData?.phoneNumber}</Text>
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.darkModeText}>Dark mode</Text>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
          style={{transform: [{scaleX: 1.3}, {scaleY: 1.3}]}}
        />
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    justifyContent: 'space-between',
    paddingVertical: '40%',
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 20,
  },
  textName: {
    fontSize: 30,
    marginBottom: 10,
    fontFamily: 'Fira Code SemiBold',
    color: 'black',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'Fira Code Regular',
    color: 'black',
  },
  darkModeText: {
    fontSize: 25,
    fontFamily: 'Fira Code Medium',
    color: 'black',
    marginRight: '35%',
  },
  profileContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
