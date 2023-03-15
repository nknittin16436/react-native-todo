import React from 'react';
import {
    View,
    StyleSheet,
    Alert,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useCamera } from 'react-native-camera-hooks';
import CustomButton from '../utils/CustomButton';
import RNFS from 'react-native-fs';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setTasks } from '../redux/reducer';

export default function Camera() {

    const [{ cameraRef }, { takePicture }] = useCamera(null);
    const navigation = useNavigation();
    const { tasks } = useSelector(state => state.task);
    const dispatch = useDispatch();
    const route = useRoute();
    const { id:taskId } = route.params;
    console.log("hello param", taskId);

    const captureHandle = async () => {
        try {
            console.log("before pi")
            const data = await takePicture();
            const filePath = data.uri;
            console.log(filePath)
            updateTask(taskId, filePath);

        } catch (error) {
            console.log(error);
        }
    }

    const updateTask = async (id, imagePath) => {

        try {

            const taskIndex = tasks.findIndex(task => task.id === id);
            if (taskIndex > -1) {
                let newTasks = [...tasks];
                newTasks[taskIndex].imageUrl = imagePath;
                console.log(newTasks,imagePath)
                await AsyncStorage.setItem('Tasks', JSON.stringify(newTasks));
                dispatch(setTasks(newTasks));
                Alert.alert('Success', 'Image attached succesfully');
                navigation.goBack();
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View style={styles.body}>
            <RNCamera
                ref={cameraRef}
                type={RNCamera.Constants.Type.front}
                style={styles.preview}
            >
                <CustomButton
                    title="Capture"
                    color='#1eb900'
                    onPressFunction={() => captureHandle()}
                />
            </RNCamera>
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
    },
    preview: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    }
});