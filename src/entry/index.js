/**
 * bundle 入口
 */
import { AppRegistry } from 'react-native';

import HPRApp from './foundation/hpr/App';
import ExampleHomeApp from '../../example/home/App'

// 容器入口
AppRegistry.registerComponent('HPRApp', () => HPRApp);

// Example 入口主页
AppRegistry.registerComponent('ExampleHomeApp', () => ExampleHomeApp);
