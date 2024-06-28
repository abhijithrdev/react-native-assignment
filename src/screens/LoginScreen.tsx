import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>LoginScreen</Text>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center',
        justifyContent: 'center',
    },
    headerText: {
        color: 'black',
        fontSize: 50,
        fontFamily: 'Fira Code Bold'
    }
})