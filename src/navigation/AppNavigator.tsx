import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LoginScreen} from '../screens';
import HomeTabNavigator from './HomeTabNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types/UserProfile';

const AppNavigator = () => {
  const Stack = createNativeStackNavigator();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserProfile>();

  const getUserSignIn = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_data');
      const userObj = jsonValue != null ? JSON.parse(jsonValue) : null;
      setUserData(userObj);
      console.log('user data set in useeffect');
      userObj.phoneVerified ? setIsLoggedIn(true) : setIsLoggedIn(false);
    } catch (error) {
      console.error('Error retrieving user sign-in data:', error);
      return null;
    }
  };

  useEffect(() => {
    getUserSignIn();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {!isLoggedIn ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Home" component={HomeTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
