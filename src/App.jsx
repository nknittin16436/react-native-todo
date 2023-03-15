import React from 'react';


import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from './screens/Splash';
import Todo from './screens/Todo';
import Done from './screens/Done';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Task from './screens/Task';
import { store } from './redux/store'
import { Provider } from 'react-redux'
import Camera from './screens/Camera';

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={
        {
          headerShown: false,
          activeTintColor: '#00ff00',
          inactiveTintColor: '#777777',
          tabBarLabelStyle: { fontSize: 15, fontWeight: 'bold' }
        }
      }

    >
      <Tab.Screen name="Todo" component={Todo}
        options={{
          tabBarLabel: 'Todo',
          tabBarIcon: ({ focused, }) => (
            <FontAwesome5 name="clipboard-list" size={focused ? 25 : 20} />

          ),
        }}
      />
      <Tab.Screen name="Done" component={Done}

        options={{
          tabBarLabel: 'Done',
          tabBarIcon: ({ focused, }) => (
            <FontAwesome5 name="clipboard-check" size={focused ? 25 : 20} />

          ),
        }}
      />



    </Tab.Navigator >
  )
}

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootStack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#0080ff'
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontSize: 25,
              fontWeight: 'bold'
            }
          }}
        >
          <RootStack.Screen name="Splash" component={Splash}
            options={{
              headerShown: false
            }}
          />
          <RootStack.Screen name="My Tasks" component={HomeTabs} />
          <RootStack.Screen name="Task" component={Task} />
          <RootStack.Screen name="Camera" component={Camera} />
        </RootStack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}



export default App;
