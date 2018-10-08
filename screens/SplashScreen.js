'use strict';

import React, { Component } from 'react';
import {
  View,
  AsyncStorage,
  StyleSheet,
  Image,
  Dimensions
} from 'react-native';
import { ProgressCircle }  from 'react-native-svg-charts';

export default class SplashScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this._checkAuth();

    this.state = {
      progress: 0.0,
      progressColor: '#474747',
      progressStrokeWidth: 10
    }
  }

  _checkAuth = async () => {
    const loggedIn = await AsyncStorage.getItem('loggedIn');

    this._showLoading();

    setTimeout(() => {
      this.props.navigation.navigate(loggedIn === "true" ? 'Auth' : 'Login');
    }, 2000)
  };

  _showLoading = () => {
    for (let i = 0; i < 9; i++) setTimeout(() => {this.setState({progress: ((i + 1) / 10)})}, (150 * (i + 1)));

    setTimeout(() => {this.setState({progress: 1, progressColor: '#00a300', progressStrokeWidth: 25})}, 1600);
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.image} source={require('../images/logo.jpg')} />
        <ProgressCircle
          style={{ height: 80, width: 80 }}
          progress={ this.state.progress }
          progressColor={ this.state.progressColor }
          backgroundColor={'#ccc'}
          strokeWidth={ this.state.progressStrokeWidth }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  image: {
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').width * 0.8
  }
})
