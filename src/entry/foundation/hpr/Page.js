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
  Blank
} from 'component';
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
      // 页面标题，onReceivedTitle 事件会保持修改
      title: '',
      // 页面是否 isReady，默认已 ready
      // onLoadStart 时设置为 false
      // onLoadResource 第一个非当前页面请求的资源文件时设置为 true
      // 如果页面没有 onLoadResource 非当前页面请求，则 onLoadEnd 时设置为 true
      isReady: true,
      // 标示当前是否是加载中的状态，onLoadStart 时会设定为 true，onLoadEnd 时会设定为 false
      isLoading: false,
      // 标示当前 webview 的 history 栈是否可以返回
      canGoBack: false,
      // 当前页面链接，onNavigationStateChange 事件会同步更新
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
          mixedContentMode="always"
          onLoadStart={this.onLoadStart}
          onLoadResource={this.onLoadResource}
          onLoadEnd={this.onLoadEnd}
          onMessage={this.invoke.listener}
          onReceivedTitle={this.onReceivedTitle}
          onProgress={this.onProgress}
          onNavigationStateChange={this.onNavigationStateChange}
          renderError={() => {
            return (
              <Blank
                message="请检查网络，点击重试"
                onPress={this.retry.bind(this)} />
            )
          }}
        />
      </View>
    );
  }

  // 前端路由的有些情况，onLoadStart 不会调，但是会调 onLoadEnd
  onLoadStart = () => {
    this.setState({
      isReady: false,
      isLoading: true
    });
  }

  onLoadEnd = () => {
    if (!this.state.isReady) {
      this.setState({
        isReady: true,
        isLoading: false
      });
      // call page start
      this.onPageStart();
    } else {
      this.setState({
        isLoading: false
      });
    }
  }

  onLoadResource = resourceUrl => {
    const { isLoading, isReady, currentUrl } = this.state;

    if (isLoading && !isReady && currentUrl != resourceUrl) {
      this.setState({
        isReady: true
      });
      // call page start
      this.onPageStart();
    }
  }

  // 页面开始事件，可以更早的做 JS 注入
  onPageStart = () => {
    // 注入 invoke
    this.webview.injectJavaScript(browserInvoke);
  }

  onReceivedTitle = title => {
    if (title === 'about:blank') {
      title = '';
    }

    // 标题变化
    this.setState({ title });
  }

  /**
   * TODO 加载进度，还没用上
   */
  onProgress = progress => {}

  /**
   * 更新 state
   */
  onNavigationStateChange = navState => {
    const { canGoBack, url } = navState;
    this.setState({
      canGoBack,
      currentUrl: url
    });
  }

  // Android 返回键
  onBackAndroid = () => {
    if (this.state.canGoBack) {
      this.webview.goBack();
    } else {
      HPR.Navigation.pop(this.props.pageKey);
    }
    return true;
  }

  // 重试
  retry () {
    this.webview.injectJavaScript('history.back();');
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
