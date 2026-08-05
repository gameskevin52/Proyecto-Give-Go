 import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { MyColors } from '../theme/AppTheme';
 4  
interface Props {
  text: string;
  onPress: () => void,
}
 9  
export const RoundedButton = ({ text, onPress }: Props) => {
  return (
    <TouchableOpacity
      style={styles.RoundedButton}
      onPress={() => onPress()}
    >
      <Text style={styles.textButton}>{text}</Text>
    </TouchableOpacity>
  )
}
20  
const styles = StyleSheet.create({
  RoundedButton: {
    width: '100%',
    height: 40,
    backgroundColor: MyColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  textButton: {
    color: 'white',
  }
});