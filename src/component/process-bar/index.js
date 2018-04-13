import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Easing
} from 'react-native';
import PropTypes from 'prop-types';

export class ProcessBar extends Component {
  constructor(props) {
    super(props);
    
    const { width } = Dimensions.get('window');

    this.state = {
      processing: props.processing,
      animatedToStartProcessing: false,
      animatedToFinishProcessing: false,
      processOpacity: new Animated.Value(0),
      percentWithWidth: new Animated.Value(-width)
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // 开始加载进程（当前停止，下一个状态开始）
    if (nextProps.processing && !prevState.processing) {
      return {
        processing: nextProps.processing,
        animatedToStartProcessing: true
      };
    }

    // 加载完毕（当前正在加载，下一个状态停止）
    if (!nextProps.processing && prevState.processing) {
      return {
        processing: nextProps.processing,
        animatedToFinishProcessing: true
      };
    }

    return {
      processing: nextProps.processing
    };
  }

  componentDidUpdate() {
    if (this.state.animatedToStartProcessing) {
      this.startProcessing();
      this.setState({ animatedToStartProcessing: false });
    }

    if (this.state.animatedToFinishProcessing) {
      this.finishedProcessing();
      this.setState({ animatedToFinishProcessing: false });
    }
  }

  render() {
    return (
      <Animated.View
        style={[
          styles.process,
          {
            backgroundColor: this.props.color,
            opacity: this.state.processOpacity,
            transform: [{
              translateX: this.state.percentWithWidth
            }]
          }
        ]}>
      </Animated.View>
    );
  }

  startProcessing() {
    const { width } = Dimensions.get('window');

    this.state.processOpacity.setValue(1);
    this.state.percentWithWidth.setValue(-width);
    Animated.timing(
      this.state.percentWithWidth,
      {
        toValue: -0.01 * width,
        duration: 1000 * 15,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true
      }
    ).start();
  }

  finishedProcessing() {
    Animated.sequence([
      Animated.timing(
        this.state.percentWithWidth,
        {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true
        }
      ),
      Animated.timing(
        this.state.processOpacity,
        {
          toValue: 0,
          duration: 100,
          useNativeDriver: true
        }
      ),
    ]).start();
  }
}

ProcessBar.defaultProps = {
  processing: false,
  color: '#2c9adb'
};

ProcessBar.propTypes = {
  processing: PropTypes.bool,
  color: PropTypes.string
};

const styles = StyleSheet.create({
  process: {
    marginTop: -2,
    height: 2
  }
});
