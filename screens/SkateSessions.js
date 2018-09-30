'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  BackHandler
} from 'react-native';

type Props = {};
export default class SkateSessions extends Component<Props> {
  static navigationOptions = {
    title: 'Skate Sessions',
    headerLeft: null
  };

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
  }

  render() {
    return (
      <View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

})
