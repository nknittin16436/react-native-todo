import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import CustomButton from '../utils/CustomButton'
import { useSelector, useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { setTasks } from '../redux/reducer'
import { useNavigation } from '@react-navigation/native'
import CheckBox from '@react-native-community/checkbox';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
const Task = () => {
  const { tasks, taskId } = useSelector(state => state.task);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [done, setDone] = useState(false);
  const [color, setColor] = useState('white')


  useEffect(() => {
    getTask()
  }, [])


  const getTask = () => {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setDone(task.done)
      setColor(task.color)
    }
  }

  const setTask = async () => {
    if (title.trim().length === 0) {
      Alert.alert('Warning!', 'Please enter alteast one char in title')
    }
    else {
      try {
        const task = {
          id: taskId,
          title: title,
          description: description,
          done: done,
          color:color
        }

        const index = tasks.findIndex(task => task.id == taskId)
        let newTasks = [];
        if (index > -1) {
          newTasks = [...tasks];
          newTasks[index] = task;
        }
        else {
          newTasks = [...tasks, task]
        }
        await AsyncStorage.setItem('Tasks', JSON.stringify(newTasks));
        dispatch(setTasks(newTasks));
        Alert.alert("Success", 'Task Saved Succesfully')
        navigation.goBack();
      } catch (error) {

      }
    }
  }
  return (
    <View style={styles.body}>
      <TextInput
        value={title}
        style={styles.input}
        placeholder="Title"
        onChangeText={(value) => setTitle(value)}
      />
      <TextInput
        value={description}
        style={styles.input}
        placeholder="Description"
        multiline
        onChangeText={(value) => setDescription(value)}
      />
      <View style={styles.color_bar}>
        <TouchableOpacity
          style={styles.color_white}
          onPress={() => setColor('white')}
        >
          {color === 'white' &&
            <FontAwesome5 name="check" size={25} color="#000000" />
          }
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.color_red}
          onPress={() => setColor('red')}
        >
          {color === 'red' &&
            <FontAwesome5 name="check" size={25} color="#000000" />
          }
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.color_blue}
          onPress={() => setColor('blue')}
        >
          {color === 'blue' &&
            <FontAwesome5 name="check" size={25} color="#000000" />
          }
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.color_green}
          onPress={() => setColor('green')}
        >
          {color === 'green' &&
            <FontAwesome5 name="check" size={25} color="#000000" />
          }
        </TouchableOpacity>
      </View>
      <View style={styles.checkbox}>

        <CheckBox
          value={done}
          onValueChange={(val) => setDone(val)}
        />
        <Text
          style={styles.text}
        >Is done...?</Text>
      </View>
      <CustomButton
        title="Save task"
        color="#1eb900"
        style={{ width: '100%' }}
        onPressFunction={setTask}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    padding: 10
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#555555',
    borderRadius: 10,
    backgroundColor: "#ffffff",
    textAlign: 'left',
    fontSize: 20,
    margin: 10,
    paddingHorizontal: 10
  }, checkbox: {
    flexDirection: 'row',
    margin: 10,
    alignItems: 'center'
  },
  text: {
    fontSize: 20,
    color: "#000000"
  },
  color_bar: {
    flexDirection: 'row',
    height: 50,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#555555",
    marginVertical: 10
  },
  color_white: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  }
  ,
  color_red: {
    flex: 1,
    backgroundColor: "#f28b82",
    alignItems: 'center',
    justifyContent: 'center'
  }
  ,
  color_blue: {
    flex: 1,
    backgroundColor: "#aecbfa",
    alignItems: 'center',
    justifyContent: 'center'
  }
  ,
  color_green: {
    flex: 1,
    backgroundColor: "#ccff90",
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10
  }
})

export default Task