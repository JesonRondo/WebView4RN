/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default class Page extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: props.code || '404',
      msg: props.message || '找不到页面'
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>[{this.state.code}] {this.state.msg}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
