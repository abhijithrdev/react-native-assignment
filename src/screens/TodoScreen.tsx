import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const TodoScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>TodoScreen</Text>
    </View>
  )
}

export default TodoScreen

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