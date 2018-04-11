import React from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';

const images = new Map();
images.set('scan', require('./assets/scan.png'));
images.set('close', require('./assets/close.png'));

export const Icon = ({type, onPress}) => 
  <TouchableOpacity
    onPress={onPress}>
    <Image
      style={styles.icon}
      source={images.get(type)} />
  </TouchableOpacity>

Icon.propTypes = {
  type: PropTypes.oneOf(['scan', 'close']).isRequired,
  onPress: PropTypes.func
};

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26
  }
});
