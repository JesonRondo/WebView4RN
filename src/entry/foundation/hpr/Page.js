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
  PAGE_URLCHANGE_EVENT = 'hrp::urlchanged'
  PAGE_ONLOAD_EVENT = 'hrp::pageonload'

  constructor (props) {
    super(props);
    this.state = {
      title: '',
      progress: 100,
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
        <ProgressBar progress={this.state.progress} />
        <AndroidWebView
          ref={webview => this.webview = webview}
          source={{uri: this.props.startPage || 'about:blank'}}
          style={styles.content}
          onLoadStart={this.onLoadStart}
          onLoadEnd={this.onLoadEnd}
          onMessage={this.onMessage}
          onReceivedTitle={this.onReceivedTitle}
          onProgress={this.onProgress}
          onNavigationStateChange={this.onNavigationStateChange}
        />
      </View>
    );
  }

  onLoadStart = () => {
    console.log('start');
    this.setState({
      isLoading: true
    });
  }

  onLoadEnd = () => {
    console.log('end');
    this.setState({
      isLoading: false
    });
  }

  // 解析自己的 Message
  parseMyMessage (data) {
    return new Promise((resolve, reject) => {
      try {
        var customEvent = JSON.parse(data);
        if (customEvent && customEvent.command) {
          resolve(customEvent);
        } else {
          reject();
        }
      } catch (e) {
        reject();
      }
    });
  }

  tryToSendMyMessageToWebView(type) {
    if (type === this.PAGE_URLCHANGE_EVENT) {
      this.webview.injectJavaScript(`
          var customEvent = {
            command: '${type}',
            data: {
              title: document.title,
              currentUrl: location.href
            }
          };
          window.postMessage(JSON.stringify(customEvent));
      `);
    } else if (type === this.PAGE_ONLOAD_EVENT) {
      this.webview.injectJavaScript(`
        if (location.href === "${this.state.currentUrl}") {
          var customEvent = {
            command: '${type}',
            data: {}
          };
        }
      `);
    }
  }

  // 页面可以执行 JS，onPageReady 事件由 Progress 事件分解而来
  // 可以比较早的注入 JS，设置 title 等
  onPageReady = () => {
    console.log('on page ready');
    // 注入 invoke
    // this.webview.injectJavaScript(browserInvoke);
  }

  // 页面加载完毕，onPageLoad 事件由 Progress 事件分解而来
  // 可以确保加载完毕最后一刻的修改依然能生效
  // 如：前端跳转设置了 title，由于不用加载资源，injectedJavascript 时会很早
  //    但实际上 progress 依然在执行，当最终 progress 为 1（完毕）时才会触发 onPageLoad
  onPageLoad = () => {
    console.log('on page load');
    // 重新设置一次 title
    this.webview.injectJavaScript('hpr.setNavigationBarTitle({ title: document.title });');
  }

  onMessage = (evt) => {
    if (evt && evt.nativeEvent && evt.nativeEvent.data) {
      this
        .parseMyMessage(evt.nativeEvent.data)
        .then(customEvent => {
          const { command, data } = customEvent;
          // ready
          if (command === this.PAGE_URLCHANGE_EVENT) {
            console.log(data);
            // this.setState({
            //   title: data.title,
            //   currentUrl: data.currentUrl
            // });
            this.onPageReady();
          } else if (command === this.PAGE_ONLOAD_EVENT) {
            this.onPageLoad();
          }
        })
        .catch(() => {
          // 解析不了的丢给 invoke 处理
          this.invoke.listener.call(this, evt);
        });
    } else {
      this.invoke.listener.call(this, evt);
    }
  }

  onReceivedTitle = (title) => {
    this.setState({ title });
  }

  onProgress = (progress) => {
    console.log(progress);
    this.tryToSendMyMessageToWebView(this.PAGE_URLCHANGE_EVENT);
    if (progress > 0.999999999) {
      this.tryToSendMyMessageToWebView(this.PAGE_ONLOAD_EVENT);
    }
    this.setState({ progress });
  }

  onNavigationStateChange = (navState) => {
    console.log(navState);
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
