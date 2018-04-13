import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  PixelRatio
} from 'react-native';
import { Icon } from 'component';
import PropTypes from 'prop-types';
import HPR from 'plugin/rn';

export class Navigation extends Component {
  render() {
    return (
      <View style={styles.header}>
        <View style={styles.leftBtn}>
          <Icon type="close"
            onPress={this.closeWindow.bind(this)} />
        </View>
        <View style={styles.split}></View>
        <Text style={styles.headerTxt}
          numberOfLines={1}>
          { this.props.title }
        </Text>
      </View>
    );
  }

  closeWindow () {
    HPR.Navigation.pop(this.props.pageKey);
  }
}

Navigation.propTypes = {
  pageKey: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 48
  },
  headerTxt: {
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
    fontSize: 18,
    color: '#333'
  },
  leftBtn: {
    padding: 10
  },
  split: {
    width: 1 / PixelRatio.get(),
    height: 24,
    backgroundColor: '#ccc'
  }
});
