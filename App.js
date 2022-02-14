import {Button, Dimensions, Pressable, StyleSheet, Text, View, TouchableHighlight, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {useEffect, useState} from "react";

const screenWidth = Dimensions.get('window').width

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
    if (subtract && counter[type] === 0) return
    const newCounterValues = type === 'total' ?
      {...counter, total: counter.total + (subtract ? -1 : 1)} :
      {...counter, [type]: counter[type] + (subtract ? -1 : 1), total: counter.total + (subtract ? -1 : 1)}
    try {await AsyncStorage.setItem('data', JSON.stringify(newCounterValues))}
    catch (error) {console.log(error)}
    finally {setCounter(newCounterValues)}
  }

  const buttonsConfig = [
    {type: 'dislikes', title: '👎', undoTitle: 'Undo dislike', color: 'red', role: true},
    {type: 'pretty', title: '🤌', undoTitle: 'Undo pretty', color: 'green', role: false},
    {type: 'smash', title: '🔥', undoTitle: 'Undo hot', color: 'orange', role: false},
    {type: 'total', title: 'Boring button', undoTitle: 'Undo boring button', color: 'blue', role: false}
  ]

  return (
    loading ?
      <View>
        <Text>Loading...</Text>
      </View> :
      <View style={styles.container}>
        <View style={styles.dataWrapper}>
          <Text style={styles.dataText}>
            {counter.total}{"\n"}
            Pretty: {getPercentage(counter.pretty)}% {counter.pretty}{"\n"}
            Smash: {getPercentage(counter.smash)}% {counter.smash}{"\n"}
            Dislikes: {getPercentage(counter.dislikes)}% {counter.dislikes}{"\n"}
          </Text>
          <Text style={styles.totalCounter}>{counter.total}</Text>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: screenWidth * 0.68
          }}>
            {['dislikes', 'smash', 'pretty'].map(type => (
                <TouchableOpacity
                    key={type}
                    style={{alignItems: 'center'}}
                    onPress={() => handleUpdate(type,true)}>
                  <View style={{flexDirection: "row", alignItems: 'flex-end'}}>
                    <Text style={[styles.dataCounter,
                      {fontSize: type === 'smash' ? 50 : 32, color: type === 'dislikes' ? 'coral' : '#fff'}
                    ]}>
                      {getPercentage(counter[type])}
                    </Text>
                    <Text style={[styles.percentSymbol,
                      {lineHeight: type === 'smash' ? 38 : 32, color: type === 'dislikes' ? 'coral' : '#fff'}
                    ]}>%</Text>
                  </View>
                  <Text style={[styles.dataQuantity, {color: type === 'dislikes' ? 'coral' : '#fff'}]}>{counter[type]}</Text>
                </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.buttonsWrapper}>
          {buttonsConfig.map(button => (
            <View key={button.type}>
              <TouchableHighlight
                onPress={() => handleUpdate(button.type)}
                style={[
                    styles.mainButton,
                    {width: button.type === 'total' ? screenWidth * 0.68 : screenWidth * 0.2}
                ]}
                color={button.color}>
                <Text style={styles.buttonText}>{button.title}</Text>
              </TouchableHighlight>
            </View>
          ))}
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: screenWidth * 0.16
  },

  dataWrapper: {
    marginTop: screenWidth * 0.3
  },

  dataText: {
    color: '#fff'
  },

  totalCounter: {
    color: '#fff',
    fontSize: 72,
    fontWeight: '700'
  },

  dataCounter: {
    fontWeight: '700',
    fontSize: 32,
    color: '#fff'
  },

  dataQuantity: {
    color: '#fff',
    fontSize: 16
  },

  percentSymbol: {
    fontSize: 18,
    lineHeight: 32,
    color: '#fff',
    fontWeight: '700'
  },

  mainButton: {
    borderRadius: 20,
    backgroundColor: '#242424',
    height: screenWidth * 0.2,
    justifyContent: 'center',
    marginBottom: screenWidth * 0.04
  },

  buttonText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#fff'
  },

  buttonsWrapper: {
    flexDirection: "row",
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: screenWidth * 0.1
  }
});