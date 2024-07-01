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
import {CommonActions, useNavigation} from '@react-navigation/native';

GoogleSignin.configure({
  webClientId:
    '1044290260539-9a99tv81q8rnvgjt0s8gss6u2nb909ad.apps.googleusercontent.com',
});

const LoginScreen = () => {
  const navigation = useNavigation();

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
    } catch (error) {
      console.error('Error retrieving user sign-in data:', error);
      return null;
    }
  };

  useEffect(() => {
    getUserSignIn();
  }, []);

  const onGoogleButtonPress = async () => {
    try {
      // Start the Google sign-in process and wait for the idToken
      const {idToken} = await GoogleSignin.signIn();

      // Create a Google credential with the idToken
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign in with the Google credential using Firebase Authentication
      const signIn = await auth().signInWithCredential(googleCredential);

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
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
    } catch (error) {
      console.error(error);
    }
  };

  const confirmCode = async () => {
    try {
      if (confirm) {
        const codeConfirmation = await confirm.confirm(verificationCode);
        userData.phoneNumber = phoneNumber;
        userData.phoneVerified = true;
        const updatedJsonValue = JSON.stringify(userData);
        await AsyncStorage.setItem('@user_data', updatedJsonValue);

        navigation.navigate('TodoScreen');
      }
    } catch (error) {
      console.error('Invalid code.', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Toodoo</Text>
      {!isSignedIn ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Pressable onPress={onGoogleButtonPress} style={styles.button}>
            <Ionicons name="logo-google" color={'#191725'} size={25} />
            <Text style={styles.signinText}>Sign-in with Google</Text>
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
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 50,
    fontFamily: 'Fira Code Bold',
    color: '#191725',
    textAlign: 'center',
    top: 150,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    paddingVertical: 20,
    width: '90%',
    backgroundColor: 'white',
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    color: 'black',
  },
  signinText: {
    fontSize: 20,
    fontFamily: 'Fira Code Medium',
    color: '#191725',
    paddingLeft: 20,
  },
});

export default LoginScreen;
