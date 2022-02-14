import {Button, StyleSheet, Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useEffect, useState} from "react";

export default function App() {

  const [loading, setLoading] = useState(true)
  const [counter, setCounter] = useState({
    total: 0,
    dislikes: 0,
    pretty: 0,
    smash: 0
  })

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('data')
      value && setCounter(JSON.parse(value))
    }
    catch(e) {console.log(e)}
  }

  useEffect(() => {getData().then(() => setLoading(false))}, [])

  const getPercentage = number => counter.total ? Math.round(number / (counter.total / 100)) : 0

  const handleUpdate = async (type, subtract) => {
    const newCounterValues = type === 'total' ?
      {...counter, total: counter.total + (subtract ? -1 : 1)} :
      {...counter, [type]: counter[type] + (subtract ? -1 : 1), total: counter.total + (subtract ? -1 : 1)}
    try {await AsyncStorage.setItem('data', JSON.stringify(newCounterValues))}
    catch (error) {console.log(error)}
    finally {setCounter(newCounterValues)}
  }

  const buttonsConfig = [
    {type: 'dislikes', title: 'Dislike', undoTitle: 'Undo dislike', color: 'red'},
    {type: 'total', title: 'Boring button', undoTitle: 'Undo boring button', color: 'blue'},
    {type: 'pretty', title: 'Pretty girl', undoTitle: 'Undo pretty', color: 'green'},
    {type: 'smash', title: 'So hot!!', undoTitle: 'Undo hot', color: 'orange'}
  ]

  return (
    loading ?
      <View>
        <Text>Loading...</Text>
      </View> :
      <View style={styles.container}>
        <Text>
          Total: {counter.total}{"\n"}
          Pretty: {getPercentage(counter.pretty)}% {counter.pretty}{"\n"}
          Smash: {getPercentage(counter.smash)}% {counter.smash}{"\n"}
          Dislikes: {getPercentage(counter.dislikes)}% {counter.dislikes}{"\n"}
        </Text>

        {buttonsConfig.map(button => (
          <View key={button.type}>
            <Button
              onPress={() => handleUpdate(button.type)}
              title={button.title}
              color={button.color}/>
            <Button
              onPress={() => handleUpdate(button.type,true)}
              title={button.undoTitle}
              color={button.color}/>
          </View>
        ))}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});