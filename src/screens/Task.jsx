import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, Modal, Image, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import CustomButton from '../utils/CustomButton'
import { useSelector, useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { setTasks } from '../redux/reducer'
import { useNavigation } from '@react-navigation/native'
import CheckBox from '@react-native-community/checkbox';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import PushNotification from "react-native-push-notification";
import RNFS from 'react-native-fs'

const Task = () => {
  const { tasks, taskId } = useSelector(state => state.task);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [done, setDone] = useState(false);
  const [color, setColor] = useState('white');
  const [showBellModal, setShowBellModal] = useState(false);
  const [bellTime, setBellTime] = useState("1");
  const [image, setImage] = useState("");


  useEffect(() => {

    navigation.addListener('focus', () => {

      getTask()
    })
  }, [])


  const getTask = () => {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setDone(task.done)
      setColor(task.color)
      setImage(task.imageUrl)
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
          color: color,
          imageUrl: image
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

  const setTaskAlarm = () => {
    PushNotification.localNotificationSchedule({
      channelId: 'task-channel',
      title: title,
      message: description,
      date: new Date(Date.now() + parseInt(bellTime) * 60 * 1000),
      allowWhileIdle: true,
    });

    setShowBellModal(false);
  }
  const deleteImage = async () => {

    try {
      RNFS.unlink(image);
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      if (taskIndex > -1) {
        let newTasks = [...tasks];
        newTasks[taskIndex].imageUrl = '';
        await AsyncStorage.setItem('Tasks', JSON.stringify(newTasks));
        dispatch(setTasks(newTasks));
        getTask();
        Alert.alert('Success', 'Image deleted succesfully');
        navigation.goBack();
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <ScrollView>

      <View style={styles.body}>

        <Modal
          visible={showBellModal}
          transparent
          onRequestClose={() => setShowBellModal(false)}
          animationType='slide'
          hardwareAccelerated
        >
          <View style={styles.centered_view}>
            <View style={styles.bell_modal}>
              <View style={styles.bell_body}>
                <Text style={styles.text}>Remind me after</Text>
                <TextInput style={styles.bell_input}
                  keyboardType='numeric'
                  value={bellTime}
                  onChangeText={(value) => setBellTime(value)}
                />
                <Text style={styles.text}>minutes</Text>
              </View>
              <View style={styles.bell_buttons}>
                <TouchableOpacity
                  style={styles.bell_cancel_button}
                  onPress={() => setShowBellModal(false)}
                >
                  <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={setTaskAlarm}
                  style={styles.bell_ok_button}
                >
                  <Text>Ok</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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

        <View style={styles.extra_row}>
          <TouchableOpacity
            style={styles.extra_button}
            onPress={() => setShowBellModal(true)}
          >
            <FontAwesome5 name="bell" size={25} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.extra_button}
            onPress={() => navigation.navigate('Camera', {
              id: taskId
            })

            }
          >
            <FontAwesome5 name="camera" size={25} color="#ffffff" />
          </TouchableOpacity>
        </View>
        {image ? <View>
          <Image
            source={{ uri: image }}
            style={styles.image}
          />
          <TouchableOpacity
            style={styles.delete}
            onPress={() => deleteImage()}
          >
            <FontAwesome5 name="trash" size={25} color="#ff3636" />
          </TouchableOpacity>

        </View> : null}
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
    </ScrollView>

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
  },
  extra_row: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  extra_button: {
    flex: 1,
    height: 50,
    backgroundColor: "#0080ff",
    borderRadius: 10,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  centered_view: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: 'center',
    alignItems: 'center'
  }
  , bell_modal: {
    width: 300,
    height: 200,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#000000"
  },
  bell_body: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bell_buttons: {
    flexDirection: 'row',
    height: 50
  },
  bell_input: {
    width: 50,
    borderWidth: 1,
    borderColor: "#555555",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 20,
    margin: 10
  },
  bell_cancel_button: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#00000",
    borderBottomLeftRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bell_ok_button: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#00000",
    borderBottomRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: 300,
    height: 300,
    margin: 20,
    resizeMode: 'stretch'
  },
  delete: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: "#ffffff80",
    margin: 10,
    borderRadius: 50
  }
})

export default Task