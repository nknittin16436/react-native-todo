import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native'
import React, { useEffect } from 'react'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setTaskId, setTasks } from '../redux/reducer';
import GlobalStyle from '../utils/GlobalStyle';
import CheckBox from '@react-native-community/checkbox';

const Todo = () => {
    const navigation = useNavigation();


    const { tasks } = useSelector(state => state.task);
    console.log("use", tasks);
    const dispatch = useDispatch();

    useEffect(() => {
        getTasks();
    }, [])

    const getTasks = async () => {
        try {

            const tasks = await AsyncStorage.getItem('Tasks');
            console.log("effect", tasks);
            if (tasks) {
                const parsedTask = JSON.parse(tasks);
                console.log("parsed", parsedTask)
                dispatch(setTasks(parsedTask));
            }
        } catch (error) {
            console.log(error)
        }
    }
    const deleteTask = async (taskId) => {
        const filteredTasks = tasks.filter((task) => task.id !== taskId);
        await AsyncStorage.setItem('Tasks', JSON.stringify(filteredTasks))
        dispatch(setTasks(filteredTasks));
        Alert.alert('Success', 'Task deleted succesfully')

    }

    const checkTask = async (taskId, doneValue) => {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex > -1) {
            let newTasks = [...tasks];
            newTasks[taskIndex].done = doneValue;
            await AsyncStorage.setItem('Tasks', JSON.stringify(newTasks))
            dispatch(setTasks(newTasks));
            Alert.alert('Success', 'Status Updated succesfully')
        }
    }
    return (
        <View style={styles.body}>
            <FlatList
                data={tasks.filter(task => task.done === false)}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.todo}

                        onPress={
                            () => {
                                dispatch(setTaskId(item.id));
                                navigation.navigate('Task')
                            }
                        }
                    >

                        <View style={styles.item_row}>
                            <View style={[
                                {

                                    backgroundColor:
                                        item.color === 'red' ? '#f28b82' :
                                            item.color === 'blue' ? '#aecbfa' :
                                                item.color === 'green' ? '#ccff90' : "#ffffff"
                                },
                                styles.color
                            ]}>

                            </View>
                            <CheckBox
                                value={item.done}
                                onValueChange={(newValue) => checkTask(item.id, newValue)}
                            />
                            <View style={styles.item_body}>

                                <Text
                                    style={[GlobalStyle.CustomFontHW, styles.title]}
                                    numberOfLines={1}
                                >
                                    {item.title}
                                </Text>
                                <Text
                                    style={[GlobalStyle.CustomFontHW, styles.subTitle]}
                                    numberOfLines={1}
                                >
                                    {item.description}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.delete}
                                onPress={() => deleteTask(item.id)}
                            >
                                <FontAwesome5 name="trash" size={25} color="#ff3636" />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>

                )}

            />
            <TouchableOpacity style={styles.button} onPress={async () => {
                dispatch(setTaskId(tasks.length + 1))
                navigation.navigate('Task')
            }
            }
            >
                <FontAwesome5
                    name="plus"
                    size={20}
                    color="#fff"

                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1
    }
    , button: {
        height: 60,
        width: 60,
        borderRadius: 30,
        backgroundColor: "#0080ff",
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 10,
        right: 10,
        elevation: 5
    },
    todo: {
        marginHorizontal: 10,
        marginVertical: 4,
        paddingRight: 10,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        elevation: 10
    },
    item_row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    item_body: {
        flex: 1
    },
    title: {
        color: "#000000",
        fontSize: 30,
        margin: 5
    },
    subTitle: {
        color: "#000000",
        fontSize: 20,
        margin: 5
    },
    delete: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'

    },
    color: {
        width: 20,
        height: 100,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,

    }

})

export default Todo