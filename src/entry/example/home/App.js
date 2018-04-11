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
  Button,
  TextInput
} from 'react-native';
import {
  Icon
} from 'component';

import HPR from 'bridge';

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      url: 'https://m.baidu.com'
    };
  }

  setURL(url) {
    this.setState({ url })
  }

  openURL() {
    HPR.Navigation.push(this.state.url);
  }

  openScaner() {
    HPR.Camera
      .QRCodeScanner()
      .then(str => {
        this.setURL(str);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>容器测试主页</Text>
        <View style={styles.editBox}>
          <Text style={styles.label}>URL</Text>
          <View style={styles.line}>
            <TextInput
              style={styles.input}
              placeholder="wantna a url to open it!"
              defaultValue={this.state.url}
              onChangeText={this.setURL.bind(this)} />
            <Icon
              type="scan"
              onPress={this.openScaner.bind(this)} />
          </View>
        </View>
        <Button
          title="打开URL"
          onPress={this.openURL.bind(this)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
    color: '#666'
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  editBox: {
    marginBottom: 40
  },
  input: {
    flex: 1,
  }
});
