/**
 * bundle 入口
 */
import { AppRegistry } from 'react-native';

import HPRApp from './foundation/hpr/App';
import EmptyApp from './foundation/empty/App';
import ExampleHomeApp from '../../example/home/App';

// 容器入口
AppRegistry.registerComponent('HPRApp', () => HPRApp);

// 空页面
AppRegistry.registerComponent('EmptyApp', () => EmptyApp);

// Example 入口主页
AppRegistry.registerComponent('ExampleHomeApp', () => ExampleHomeApp);
