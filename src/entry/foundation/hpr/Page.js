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
  View
} from 'react-native';
import {
  Navigation,
  ProgressBar,
  AndroidWebView,
} from 'component';
import HPR from 'plugin/rn';
import createInvoke from 'react-native-webview-invoke/native';
import browserInvoke, { invokePlugins } from 'plugin/web';

export default class Page extends Component {
  webview
  HPR = HPR
  invoke = createInvoke(() => this.webview)
  PAGE_ONLOAD_EVENT = 'hrp::pageonload'

  constructor (props) {
    super(props);
    this.state = {
      title: '',
      isLoading: false,
      canGoBack: false,
      currentUrl: 'about:blank'
    };
  }

  componentDidMount() {
    // 注入 plugin 中定义的方法
    invokePlugins.install(this);
    // 监听 Android 物理返回键
    BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
  }

  componentWillUnmount() {
    // 取消监听 Android 物理返回键
    BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
  }

  render() {
    return (
      <View style={styles.container}>
        <Navigation
          pageKey={this.props.pageKey}
          title={this.state.title} />
        <ProgressBar status={this.state.isLoading ? 'loading' : 'complete'} />
        <AndroidWebView
          ref={webview => this.webview = webview}
          source={{uri: this.props.startPage || 'about:blank'}}
          style={styles.content}
          onLoadStart={this.onLoadStart}
          onLoadResource={this.onLoadResource}
          onLoadEnd={this.onLoadEnd}
          onMessage={this.invoke.listener}
          onReceivedTitle={this.onReceivedTitle}
          onProgress={this.onProgress}
          onNavigationStateChange={this.onNavigationStateChange}
        />
      </View>
    );
  }

  // 前端路由的有些情况，onLoadStart 不会调，但是会调 onLoadEnd
  onLoadStart = () => {
    console.log('加载开始');
    this.setState({
      isLoading: true
    });
  }

  onLoadResource = resourceUrl => {
    console.log('   ' + (this.state.isLoading ? 'loading': 'loaded') + ' @onLoadResource: ' + resourceUrl);
  }

  onLoadEnd = () => {
    console.log('加载结束');
    this.setState({
      isLoading: false
    });
  }

  // TODO
  onPageReady = () => {
    console.log('on page ready');
    // 注入 invoke
    // this.webview.injectJavaScript(browserInvoke);
  }

  onReceivedTitle = title => {
    // 标题变化
    this.setState({ title });
  }

  /**
   * TODO 加载进度
   */
  onProgress = progress => {}

  onNavigationStateChange = navState => {
    const { canGoBack, url } = navState;

    this.setState({
      canGoBack,
      currentUrl: url
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
