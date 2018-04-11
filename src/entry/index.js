/**
 * bundle 入口
 */
import { AppRegistry } from 'react-native';

import HPRApp from 'entry/foundation/hpr/App';
import EmptyApp from 'entry/foundation/empty/App';
import ExampleHomeApp from 'entry/example/home/App';

// 容器入口
AppRegistry.registerComponent('HPRApp', () => HPRApp);
// 空页面，默认页
AppRegistry.registerComponent('EmptyApp', () => EmptyApp);

// Example 入口主页，To Run Demo
AppRegistry.registerComponent('ExampleHomeApp', () => ExampleHomeApp);
