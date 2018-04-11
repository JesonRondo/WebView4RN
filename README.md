# WebView4RN

React Native 版 H5 混合开发框架 HPR（Hybrid Platform for ReactNative）

### 打开方式

#### Android

```java
Intent intent = new Intent(currentActivity, HPRActivity.class);
intent.putExtra("startPage", "https://m.baidu.com");
currentActivity.startActivity(intent);
```
