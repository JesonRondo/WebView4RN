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
      startPage: ''
    };
  }

  componentWillMount () {
    const nativeEventListener = DeviceEventEmitter.addListener('WebViewLoadRequest',
      e => {
        console.log('native Emit');
        console.log(e);
        this.setState({
          url: e.url
        });
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTxt}>百度一下</Text>
        </View>
        <WebView
          source={{uri: 'http://h5.zywawa.com/shared_room/shared_room.html?wawaid=410&romid=438&from=singlemessage'}}
          style={styles.content}
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
    fontSize: 14
  },
  content: {
    flex: 1
  },
});
