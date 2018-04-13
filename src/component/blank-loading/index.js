import React from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator
} from 'react-native';
import PropTypes from 'prop-types';

export const BlankLoading = ({color}) => (
  <View style={styles.loading}>
    <ActivityIndicator size="large" color={color} />
  </View>
);

BlankLoading.defaultProps = {
  color: '#2c9adb'
};

BlankLoading.propTypes = {
  color: PropTypes.string
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
