import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ModalComponent = ({isModalVisible, item, onClose}) => {
  const [updatedTodo, setUpdatedTodo] = useState('');
  return (
    <Modal
      isVisible={isModalVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Update your Task</Text>

          <Pressable onPress={onClose} style={{justifyContent: 'flex-end'}}>
            <Ionicons name="close" color={'#191725'} size={35} />
          </Pressable>
        </View>

        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder={item.title}
            onChangeText={text => setUpdatedTodo(text)}
            keyboardType="default"
            placeholderTextColor={'black'}
            value={updatedTodo}
          />
        </View>
        <Pressable
          // onPress={}
          style={styles.pressableStyle}>
          <Text style={styles.pressableText}>Update</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default ModalComponent;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    color: 'black',
    fontFamily: 'Fira Code SemiBold',
    fontSize: 23,
  },
  textInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  textInput: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 10,
    width: '90%',
    backgroundColor: 'white',
    elevation: 5,
    color: 'black',
    borderColor: 'black',
    borderWidth: 1,
    fontFamily: 'Fira Code Light',
    fontSize: 18,
    paddingLeft: 20,
  },
  pressableStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingVertical: 10,
    width: '40%',
    backgroundColor: 'teal',
    elevation: 5,
  },
  pressableText: {
    fontSize: 20,
    fontFamily: 'Fira Code Medium',
    color: 'white',
  },
});
