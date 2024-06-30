import React, {useEffect, useState} from 'react';
import {
  View,
  Button,
  TextInput,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';

GoogleSignin.configure({
  webClientId:
    '1044290260539-9a99tv81q8rnvgjt0s8gss6u2nb909ad.apps.googleusercontent.com',
});

const LoginScreen = ({navigation}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userData, setUserData] = useState<object | null>({});

  const getUserSignIn = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@user_data');
      const userObj = jsonValue != null ? JSON.parse(jsonValue) : null;
      setUserData(JSON.parse(userObj));
      console.log('user data set in useeffect');
    } catch (error) {
      console.error('Error retrieving user sign-in data:', error);
      return null;
    }
  };

  useEffect(() => {
    getUserSignIn();
  }, []);

  useEffect(() => {
    console.log('userData', userData);
  }, [userData]);

  const onGoogleButtonPress = async () => {
    try {
      console.log('starting sign in process');

      // Start the Google sign-in process and wait for the idToken
      const {idToken} = await GoogleSignin.signIn();
      console.log('idToken', idToken);

      // Create a Google credential with the idToken
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      console.log('googleCredential', googleCredential);

      // Sign in with the Google credential using Firebase Authentication
      const signIn = await auth().signInWithCredential(googleCredential);
      console.log('signIn', JSON.stringify(signIn.user));

      //storing userdata in async storage
      await AsyncStorage.setItem('@user_data', JSON.stringify(signIn.user));

      setIsSignedIn(true);
    } catch (error) {
      // Log any errors that occur during the sign-in process
      console.error(error);
      setIsSignedIn(false);
    }
  };

  const signInWithPhoneNumber = async () => {
    try {
      console.log('starting phone verification');

      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      console.log('confirmation', confirmation);

      setConfirm(confirmation);
    } catch (error) {
      console.error(error);
    }
  };

  const confirmCode = async () => {
    try {
      if (confirm) {
        const codeConfirmation = await confirm.confirm(verificationCode);
        console.log('codeConfirmation', codeConfirmation);
        userData.phoneNumber = phoneNumber;
        userData.phoneVerified = true;
        const updatedJsonValue = JSON.stringify(userData);
        await AsyncStorage.setItem('@user_data', updatedJsonValue);
        console.log('updated phone verified');

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'HomeTabNavigator'}],
          }),
        );
      }
    } catch (error) {
      console.error('Invalid code.', error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
        justifyContent: 'space-between',
      }}>
      <Text
        style={{
          fontSize: 50,
          fontFamily: 'Fira Code Bold',
          color: '#191725',
          textAlign: 'center',
          top: 150,
        }}>
        Toodoo
      </Text>
      {!isSignedIn ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Pressable
            onPress={onGoogleButtonPress}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 40,
              paddingVertical: 20,
              width: '90%',
              backgroundColor: 'white',
              elevation: 5,
            }}>
            <Ionicons name="logo-google" color={'#191725'} size={25} />
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Fira Code Medium',
                color: '#191725',
                paddingLeft: 20,
              }}>
              Sign-in with Google
            </Text>
          </Pressable>
        </View>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            onChangeText={text => setPhoneNumber(text)}
            keyboardType="phone-pad"
            value={phoneNumber}
          />
          <Button title="Send OTP" onPress={signInWithPhoneNumber} />
          {confirm && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Verification Code"
                onChangeText={text => setVerificationCode(text)}
                keyboardType="number-pad"
                value={verificationCode}
              />
              <Button title="Confirm Code" onPress={confirmCode} />
            </>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
  },
  googleButton: {
    width: 192,
    height: 48,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    color: 'black',
  },
});

export default LoginScreen;
