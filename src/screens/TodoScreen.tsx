import React, {useEffect, useState} from 'react';
import {
  Alert,
  BackHandler,
  Button,
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {addTodoItem, getTodoItems} from '../../helper.ts';

import ModalComponent from '../components/ModalComponent.tsx';

interface TodoItem {
  id: number;
  title: string;
}

const TodoScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [todoItems, setTodoItems] = useState([]);
  const [newTodoItem, setNewTodoItem] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to exit the app?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  // used async/await
  const fetchTodoItems = async () => {
    try {
      // // Retrieve todo items from AsyncStorage
      const items = await getTodoItems(0, 10);
      setTodoItems(todoItems);
    } catch (err) {
      setError('Failed to fetch todo items');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTodoItems();
  }, []);

  //using async/await
  const handleAddTodo = async () => {
    try {
      await addTodoItem(newTodoItem);
      const items = await getTodoItems(0, 10);
      setTodoItems(items);
      setNewTodoItem(''); // Clear input after adding item
    } catch (err) {
      setError('Failed to add todo item');
      console.error(err);
    }
  };

  const onItemPress = ({item}: {item: TodoItem}) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const onClose = () => {
    setIsModalVisible(false);
  };

  const renderItem = ({item}: {item: TodoItem}) => (
    <Pressable
      onPress={() => onItemPress({item})}
      key={item.id}
      style={styles.todoItem}>
      <Text style={styles.sectionDescription}>{item.title}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={(backgroundStyle, styles.container)}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      {/* changed nesting flatlist inside scrollview to flatlist for scrolling and rendering */}
      <FlatList
        data={todoItems}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={
          <View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>TODO</Text>
            </View>
            <TextInput
              style={styles.sectionDescription}
              placeholder="Add your todo item"
              value={newTodoItem}
              onChangeText={setNewTodoItem}
            />
            <Button title="Add" onPress={handleAddTodo} />
          </View>
        }
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <ModalComponent
        isModalVisible={isModalVisible}
        item={selectedItem}
        onClose={onClose}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Fira Code Medium',
    color: 'black'
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    fontFamily: 'Fira Code Regular',
    color: 'black'
  },
  highlight: {
    fontWeight: '700',
  },
  todoItem: {
    fontSize: 18,
    fontWeight: '400',
    borderBottomWidth: 1,
    padding: 8,
    borderBottomColor: 'gray',
  },
  errorText: {
    color: 'red',
    marginTop: 8,
    fontSize: 16,
    fontWeight: '400',
  },
});

export default TodoScreen;
