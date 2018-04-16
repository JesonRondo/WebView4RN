import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Easing
} from 'react-native';
import PropTypes from 'prop-types';

export class ProgressBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: 'complete',
      moveProgress: false,
      needToResetProgress: false,
      progressOpacity: new Animated.Value(0),
      percentWithWidth: new Animated.Value(this.percentNumToAnimateNum(1))
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let moveProgress = false;
    let needToResetProgress = false;
    
    // 进度状态有更新
    if (nextProps.status != prevState.status) {
      // 是否需要更新进度条
      moveProgress = true;

      // 是否需要重置进度
      if (nextProps.status === 'loading') {
        needToResetProgress = true;
      }
    }

    return {
      status: nextProps.status,
      moveProgress,
      needToResetProgress
    };
  }

  componentDidUpdate() {
    // 解析进度条状态参数
    this.progressMovingParse();
  }

  render() {
    return (
      <Animated.View
        style={[
          styles.progress,
          {
            backgroundColor: this.props.color,
            opacity: this.state.progressOpacity,
            transform: [{
              translateX: this.state.percentWithWidth
            }]
          }
        ]}>
      </Animated.View>
    );
  }

  /**
   * 将进度转化为动画的长度
   * @param percent 进度的取值为 [0 ~ 1]
   */
  percentNumToAnimateNum(percent) {
    const { width } = Dimensions.get('window');
    //（进度 - 1）* 完整进度条宽度
    return (percent - 1) * width;
  }

  // 解析移动参数，如果需要移动则调用移动方法
  progressMovingParse() {
    const { moveProgress, needToResetProgress } = this.state;
    if (moveProgress) { // 需要移动进度条
      if (needToResetProgress) { // 需要从头开始动画
        this.startProgressMoving();
      } else {
        this.finishProgressMoving();
      }

      this.setState({
        moveProgress: false,
        needToResetProgress: false
      });
    }
  }

  // 开始加载动画
  startProgressMoving() {
    this.state.progressOpacity.setValue(1);
    this.state.percentWithWidth.setValue(this.percentNumToAnimateNum(0));

    // 用 15s 的时间动到 0.95 的位置
    Animated.timing(
      this.state.percentWithWidth,
      {
        toValue: this.percentNumToAnimateNum(0.95),
        duration: 15 * 1000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true
      }
    ).start();
  }

  // 结束加载动画
  finishProgressMoving() {
    Animated.sequence([
      Animated.timing(
        this.state.percentWithWidth,
        {
          toValue: this.percentNumToAnimateNum(1),
          duration: 200,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true
        }
      ),
      Animated.timing(
        this.state.progressOpacity,
        {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        }
      ),
    ]).start();
  }
}

ProgressBar.defaultProps = {
  status: 'complete',
  color: '#2c9adb'
};

ProgressBar.propTypes = {
  progress: PropTypes.oneOf(['loading', 'complete']),
  color: PropTypes.string
};

const styles = StyleSheet.create({
  progress: {
    marginTop: -2,
    height: 2
  }
});
