import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setTaskId, setTasks } from '../redux/reducer';
import GlobalStyle from '../utils/GlobalStyle';

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
    return (
        <View style={styles.body}>
            <FlatList
                data={tasks}
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
                    </TouchableOpacity>

                )}

            />
            <TouchableOpacity style={styles.button} onPress={async () => {
                dispatch(setTaskId(tasks.length + 1))
                navigation.navigate('Task')
            }
            }
            >
                <FontAwesome5 name="plus" size={20} color="#fff" />
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
        paddingHorizontal: 10,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        elevation: 10
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
    }
})

export default Todo