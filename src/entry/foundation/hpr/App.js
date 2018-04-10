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
  WebView
} from 'react-native';
import createInvoke from 'react-native-webview-invoke/native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your 键盘 to reload,\n' +
    'Shake or press menu button for dev menu',
});


const invokeBrowserJSStr = `(function (global, factory) {
  global.WebViewInvoke = factory();
}(this, (function () { 'use strict';

function createEventBus() {
    var listeners = {
        send: [],
        receive: [],
        ready: []
    };

    function addEventListener(name, cb) {
        if (name in listeners) {
            var fns = listeners[name];
            if (fns.indexOf(cb) < 0) {
                fns.push(cb);
            }
        }
    }

    function removeEventListener(name, cb) {
        if (name in listeners) {
            var fns = listeners[name];
            var idx = fns.indexOf(cb);
            if (idx >= 0) {
                fns.splice(idx, 1);
            }
        }
    }

    function emitEvent(name, event) {
        if (name in listeners) {
            listeners[name].forEach(function (fn) {
                return fn(event);
            });
        }
    }
    return { addEventListener: addEventListener, removeEventListener: removeEventListener, emitEvent: emitEvent };
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var Deferred = function Deferred() {
    var _this = this;

    classCallCheck(this, Deferred);

    this.promise = new Promise(function (resolve, reject) {
        _this.resolve = resolve;
        _this.reject = reject;
    });
};

var count = 0;

function getUID() {
    return count++;
}

var getTransactionKey = function getTransactionKey(data) {
    return data.command + '(' + data.id + ')';
};

var SYNC_COMMAND = 'RNWV:sync';

function createMessager(sendHandler) {
    var needWait = [];
    var eventBus = createEventBus();
    var transactions = {};
    var callbacks = {}; 
    var fn = {};

    function isConnect() {
        return !needWait;
    }

    function bind(name) {
        return function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return send(name, args);
        };
    }

    function define(name, func) {
        callbacks[name] = function (args) {
            return func.apply(undefined, toConsumableArray(args));
        };
        !needWait && sync();
        return { define: define, bind: bind };
    }

    /** sender parts */
    function sender(data) {
        var force = data.command === SYNC_COMMAND;
        if (!force && needWait) {
            needWait.push(data);
        } else {
            sendHandler(data);
        }
        eventBus.emitEvent('send', data);
    }
    function initialize() {
        if (needWait) {
            var waiting = needWait;
            needWait = null;
            waiting.forEach(function (payload) {
                sender(payload);
            });
            eventBus.emitEvent('ready');
        }
    }

    function send(command, data) {
        var payload = {
            command: command, data: data, id: getUID(), reply: false
        };
        var defer = new Deferred();
        transactions[getTransactionKey(payload)] = defer;
        sender(payload);
        return defer.promise;
    }

    function reply(data, result) {
        data.reply = true;
        data.data = result;
        sender(data);
    }

    function listener(data) {
        if (data.reply) {
            var _key2 = getTransactionKey(data);
            transactions[_key2] && transactions[_key2].resolve(data.data);
        } else {
            if (callbacks[data.command]) {
                var result = callbacks[data.command](data.data);
                if (result && result.then) {
                    result.then(function (d) {
                        return reply(data, d);
                    });
                } else {
                    reply(data, result);
                }
            } else {
                reply(data, null);
            }
        }
        eventBus.emitEvent('receive', data);
    }

    var __sync = bind(SYNC_COMMAND);
    function _sync() {
        var defines = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        defines.filter(function (d) {
            return !(d in fn);
        }).map(function (d) {
            fn[d] = bind(d);
        });
        initialize();
        return Object.keys(callbacks);
    }
    define(SYNC_COMMAND, _sync);

    function sync() {
        __sync(Object.keys(callbacks)).then(_sync);
    }

    return { bind: bind, define: define, listener: listener, ready: sync, fn: fn, addEventListener: eventBus.addEventListener, removeEventListener: eventBus.removeEventListener, isConnect: isConnect };
}

var isBrowser = typeof window !== 'undefined';

var _createMessager = createMessager(function (data) {
    isBrowser && window.postMessage(JSON.stringify(data));
});
var bind = _createMessager.bind;
var define = _createMessager.define;
var listener = _createMessager.listener;
var ready = _createMessager.ready;
var fn = _createMessager.fn;
var addEventListener = _createMessager.addEventListener;
var removeEventListener = _createMessager.removeEventListener;
var isConnect = _createMessager.isConnect;

if (isBrowser) {
    (function () {

        var originalPostMessage = window['originalPostMessage'];

        if (originalPostMessage) {
            ready();
        } else {
            var descriptor = {
                get: function get() {
                    return originalPostMessage;
                },
                set: function set(value) {
                    originalPostMessage = value;
                    if (originalPostMessage) {
                        setTimeout(ready, 50);
                    }
                }
            };
            Object.defineProperty(window, 'originalPostMessage', descriptor);
        }

        window.document.addEventListener('message', function (e) {
            return listener(JSON.parse(e.data));
        });
    })();
}

var browser = {
    bind: bind, define: define, fn: fn, addEventListener: addEventListener, removeEventListener: removeEventListener, isConnect: isConnect
};

return browser;

})));
`;

export default class App extends Component {
  webview
  invoke = createInvoke(() => this.webview)

  constructor (props) {
    super(props);

    this.state = {
      title: ''
    };
  }

  webViewLoadStart() {
    this.setTitle('Loading...')
  }

  setTitle (title) {
    this.setState({ title });
  }

  componentDidMount() {
    this.invoke
      .define('setTitle', this.setTitle.bind(this))
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTxt}>{ this.state.title }</Text>
        </View>
        <WebView
          ref={webview => this.webview = webview}
          source={{uri: this.props.startPage || 'about:blank'}}
          style={styles.content}
          onLoadStart={this.webViewLoadStart.bind(this)}
          onMessage={this.invoke.listener}
          injectedJavaScript={`${invokeBrowserJSStr};var invoke = window.WebViewInvoke; var setTitle = invoke.bind('setTitle'); setTitle(document.title);`}
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
    backgroundColor: '#fff',
    height: 48
  },
  headerTxt: {
    fontSize: 16
  },
  content: {
    flex: 1
  },
});
