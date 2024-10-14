import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [todo, setTodo] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const storedTodos = await AsyncStorage.getItem('todos');
        if (storedTodos) {
          setTodos(JSON.parse(storedTodos)); // the list that saved at latest time load to state
        }
      } catch (error) {
        console.log('Error loading todos', error);
      }
    };
    loadTodos(); //  reload when the app is started
  }, []);

  const saveTodos = async saveTodo => {
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(saveTodo));
    } catch (error) {
      console.log('error', error);
    }
  };

  const addTodo = () => {
    if (!todo.trim()) return; // Prevent adding empty todos
    const newTodo = {id: Date.now(), text: todo};
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    saveTodos(updatedTodos);

    setTodo(''); // Clear the input after adding
  };

  const deleteTodo = async id => {
    const updatedTodo = todos.filter(x => x.id !== id);

    setTodos(updatedTodo);
    saveTodos(updatedTodo);
  };

  const updateTodos = async id => {
    const todoFound = todos.find(x => x.id === id);
    console.log('todoFound', todoFound);
    if (!todoFound) return;
    Alert.prompt(
      'Update Todo',
      'Edit',
      newUpdateText => {
        if (newUpdateText) {
          const updatedTodos = todos.map(item =>
            item.id == id ? {...item, text: newUpdateText} : item,
          );
          setTodos(updatedTodos);
          saveTodos(updatedTodos);
        }
      },
      'plain-text', //kullanıcının sadece metin girişi yapabileceğini belirtmek için
      todoFound.text, //kullanıcıya başlangıçta gösterilecek mevcut metin
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Text style={styles.headerText}> -- </Text>
        <View style={styles.inputContainer}>
          <View style={styles.buttonContainer}>
            <TextInput
              onChangeText={text => setTodo(text)} // Use onChangeText
              value={todo} // Bind value to the state
              style={styles.input}
              placeholder="Type a new Todo"
            />
            <TouchableOpacity
              onPress={addTodo}
              style={[styles.button, styles.addButton]}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={todos}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.todoItem}>
              <Text>{item.text}</Text>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => deleteTodo(item.id)}>
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => updateTodos(item.id)}
                    style={[styles.button, styles.updateButton]}>
                    <Text style={styles.buttonText}>Update</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  headerText: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  inputContainer: {},
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'gray',
  },
  buttonContainer: {flexDirection: 'row'},
  button: {
    marginLeft: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    padding: 8,
  },
  addButton: {
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  todoItem: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  updateButton: {
    backgroundColor: 'green',
  },
});
