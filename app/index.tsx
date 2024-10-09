import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, SafeAreaView, StatusBar, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import Checkbox from 'expo-checkbox';
import * as Animatable from 'react-native-animatable';
import { FontAwesome5 } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

const ToDoApp = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 5, text: 'Work for PetReady Inc.', completed: false },
    { id: 4, text: 'Get the job', completed: false },
    { id: 3, text: 'Impress recruiters', completed: false },
    { id: 2, text: 'Submit assessment', completed: true },
    { id: 1, text: 'Create todo app', completed: true },
  ]);
  const [task, setTask] = useState('');
  const scrollY = new Animated.Value(0);

  const addTask = () => {
    if (task.length > 0) {
      setTasks([...tasks, { id: Date.now(), text: task, completed: false }]);
      setTask('');
    }
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const renderTask = ({ item }: { item: Task }) => (
    <Animatable.View
      animation="fadeInUp"
      duration={600}
      style={tw`mx-4 flex-row justify-between items-center`}
    >
      <View style={tw`flex-row items-center bg-gray-100 flex-1 px-4 py-4 border border-gray-300`}>
        <Checkbox
          value={item.completed}
          onValueChange={() => toggleTaskCompletion(item.id)}
          style={tw`mr-3 text-black`}
          color={item.completed ? 'black' : undefined}
        />
        <Text style={[tw`text-lg`, item.completed && tw`line-through text-gray-500`]}>
          {item.text}
        </Text>
      </View>
      <TouchableOpacity onPress={() => deleteTask(item.id)} style={tw``}>
        <Text style={tw`bg-gray-100 text-lg w-16 flex-1 pl-5 pt-4 border border-gray-300`}>
          <FontAwesome5 name="trash-alt" size={24} color="black" />
        </Text>
      </TouchableOpacity>
    </Animatable.View>
  );

  const incompleteTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [60, 30],
    extrapolate: 'clamp',
  });

  const Separator = () => (
    <Text style={tw`pl-5 py-3 text-gray-500 my-4 text-lg`}>Completed</Text>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}  
       
    >
      <SafeAreaView style={tw`flex-1 bg-gray-200 pt-10`}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <Animated.Text style={[tw`p-5 font-bold`, { fontSize: headerHeight }]}>
          To-Do's
        </Animated.Text>
        <Animated.FlatList
          data={[...incompleteTasks, { id: -1, text: 'Completed', completed: false }, ...completedTasks]}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) =>
            item.id === -1 ? (
              <Separator />
            ) : (
              <Animatable.View animation="fadeInUp" duration={800}>
                {renderTask({ item })}
              </Animatable.View>
            )
          }
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          contentContainerStyle={tw`pb-28`}
        />
        <Animatable.View
          animation="slideInUp"
          style={tw`absolute bottom-5 left-5 right-5 flex-row items-center`}
        >
          <TextInput
            style={tw`flex-1 h-14 bg-gray-300 p-4 rounded-lg text-black my-3 text-lg`}
            placeholder="Add new task"
            placeholderTextColor="gray"
            value={task}
            onChangeText={setTask}
            selectionColor="black"
          />
          <TouchableOpacity onPress={addTask} style={tw`ml-3 w-14 h-14 bg-gray-900 p-4 rounded-lg`}>
            <Animatable.Text style={tw``}>
              <Entypo name="plus" size={24} color="white" />
            </Animatable.Text>
          </TouchableOpacity>
        </Animatable.View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ToDoApp;
