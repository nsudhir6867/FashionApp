import * as React from 'react';
import {Button as PaperButton} from 'react-native-paper';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

const Button = ({text, ...props}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        width: '100%',
        alignSelf: 'center',
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: props.backgroundColor,
        borderRadius: 8,
        ...props.style,
      }}
      disabled={props.disabled}
      onPress={props.onPress}>
      <Text
        style={{
          color: props.textColor ? props.textColor : '#ffffff',
          fontWeight: '600',
          fontSize: 16,
          lineHeight: 24,
        }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
