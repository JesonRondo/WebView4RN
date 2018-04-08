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
  WebView,
  DeviceEventEmitter
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your 键盘 to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      startPage: props.startPage,
      title: ''
    };
  }

  webViewLoadStart() {
    this.setState({
      title: 'Loading...'
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTxt}>{ this.state.title }</Text>
        </View>
        <WebView
          source={{uri: this.state.startPage}}
          style={styles.content}
          onLoadStart={this.webViewLoadStart.bind(this)}
          injectedJavaScript={'alert(document.title);'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60
  },
  headerTxt: {
    fontSize: 18
  },
  content: {
    flex: 1
  },
});
