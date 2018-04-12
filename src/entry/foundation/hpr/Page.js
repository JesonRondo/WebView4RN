/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  BackHandler,
  StyleSheet,
  Text,
  View,
  WebView
} from 'react-native';
import { Navigation } from 'component';
import HPR from 'plugin/rn';
import createInvoke from 'react-native-webview-invoke/native';
import browserInvoke, { invokePlugins } from 'plugin/web';

export default class Page extends Component {
  webview
  HPR = HPR
  invoke = createInvoke(() => this.webview)

  constructor (props) {
    super(props);
    this.state = {
      title: '',
      canGoBack: false
    };
  }

  componentDidMount() {
    // 注入 plugin 中定义的方法
    invokePlugins.install(this);

    BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
  }

  render() {
    return (
      <View style={styles.container}>
        <Navigation
          pageKey={this.props.pageKey}
          title={this.state.title} />
        <WebView
          ref={webview => this.webview = webview}
          source={{uri: this.props.startPage || 'about:blank'}}
          style={styles.content}
          onMessage={this.invoke.listener}
          onLoadStart={this.webViewLoadStart}
          onNavigationStateChange={this.onNavigationStateChange}
          injectedJavaScript={`${browserInvoke};hpr.setNavigationBarTitle({title: document.title});setTimeout(function () {hpr.pop();}, 3000)`}
        />
      </View>
    );
  }

  webViewLoadStart = () => {
    this.setState({ title: 'Loading...' });
  }

  onNavigationStateChange = (navState) => {
    this.setState({
      canGoBack: navState.canGoBack
    });
  }

  onBackAndroid = () => {
    if (this.state.canGoBack) {
      this.webview.goBack();
    } else {
      HPR.Navigation.pop(this.props.pageKey);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  content: {
    flex: 1
  },
});
