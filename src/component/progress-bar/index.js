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
    
    const { width } = Dimensions.get('window');

    this.state = {
      progress: props.progress,
      moveProgress: false,
      needToResetProgress: false,
      progressOpacity: new Animated.Value(0),
      percentWithWidth: new Animated.Value(0)
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let moveProgress = false;
    let needToResetProgress = false;
    
    if (nextProps.progress != prevState.progress) {
      // 是否需要更新进度条
      moveProgress = true;
      // 是否需要重置进度
      // if (prevState.progress < 0.0000000001 || prevState.progress > 0.9999999999) {
      if (prevState.progress > nextProps.progress) {
        needToResetProgress = true;
      }
    }

    return {
      progress: nextProps.progress,
      moveProgress,
      needToResetProgress
    };
  }

  componentDidUpdate() {
    if (this.state.moveProgress) {
      this.setProgressTo(this.state.progress, this.state.needToResetProgress);
      this.setState({
        moveProgress: false,
        needToResetProgress: false
      });
    }
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

  setProgressTo(progress, isNeedReset = false) {
    const { width } = Dimensions.get('window');

    if (isNeedReset) {
      this.state.progressOpacity.setValue(1);
      this.state.percentWithWidth.setValue((0 - 1) * width);
    }

    // 结束
    if (progress > 0.9999999999) {
      Animated.sequence([
        Animated.timing(
          this.state.percentWithWidth,
          {
            toValue: 0,
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
    } else { // 继续加载
      Animated.timing(
        this.state.percentWithWidth,
        {
          toValue: (progress - 1) * width,
          duration: 200,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true
        }
      ).start();
    }
  }
}

ProgressBar.defaultProps = {
  progress: 100,
  color: '#2c9adb'
};

ProgressBar.propTypes = {
  progress: PropTypes.number,
  color: PropTypes.string
};

const styles = StyleSheet.create({
  progress: {
    marginTop: -2,
    height: 2
  }
});
