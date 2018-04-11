/**
 * bundle 入口
 */
import { AppRegistry } from 'react-native';

import HPRPage from 'entry/foundation/hpr/Page';
import EmptyPage from 'entry/foundation/empty/Page';
import ExampleHomePage from 'entry/example/home/Page';

// 容器入口
AppRegistry.registerComponent('HPRPage', () => HPRPage);
// 空页面，默认页
AppRegistry.registerComponent('EmptyPage', () => EmptyPage);

// Example 入口主页，To Run Demo
AppRegistry.registerComponent('ExampleHomePage', () => ExampleHomePage);
