import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text
} from 'react-native';
import PropTypes from 'prop-types';

export const Blank = ({ message, onPress }) => (
  <View style={styles.blank}>
    <TouchableOpacity onPress={onPress}>
      <Text>{ message }</Text>
    </TouchableOpacity>
  </View>
);

Blank.defaultProps = {
  message: ''
};

Blank.propTypes = {
  message: PropTypes.string,
  onPress: PropTypes.func
};

const styles = StyleSheet.create({
  blank: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
