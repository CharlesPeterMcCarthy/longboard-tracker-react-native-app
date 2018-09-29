'use strict';

import React, { Component } from 'react';
import {
  View,
  AsyncStorage,
  ActivityIndicator,
  StyleSheet
} from 'react-native';

export default class SplashScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this._checkAuth();
  }

  _checkAuth = async () => {
    const loggedIn = await AsyncStorage.getItem('loggedIn');

    this.props.navigation.navigate(loggedIn === "true" ? 'Auth' : 'Login');
  };

  render() {
    return (
      <View>
        <ActivityIndicator size='large' style={styles.spinner} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  spinner: {
    marginTop: 200,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
