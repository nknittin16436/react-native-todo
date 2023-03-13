import { View, Text, StyleSheet, TextInput, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import CustomButton from '../utils/CustomButton'
import { useSelector, useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { setTasks } from '../redux/reducer'
import { useNavigation } from '@react-navigation/native'
import CheckBox from '@react-native-community/checkbox'
const Task = () => {
  const { tasks, taskId } = useSelector(state => state.task);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [done, setDone] = useState(false);


  useEffect(() => {
    getTask()
  }, [])


  const getTask = () => {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setDone(task.done)
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
          done:done
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
  }
})

export default Task