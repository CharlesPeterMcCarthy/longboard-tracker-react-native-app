'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';

type Props = {};
export default class SkateSessions extends Component<Props> {
  static navigationOptions = {
    title: 'Login',
    headerStyle: {
      backgroundColor: '#a2c2d8'
    },
    headerTitleStyle: {
      color: '#555'
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      loggingIn: false,
      emailInput: '',
      passwordInput: ''
    }
  }

  _onEmailTextChanged = (event) => {
    this.setState({ emailInput: event.nativeEvent.text })
  };

  _onPasswordTextChanged = (event) => {
    this.setState({ passwordInput: event.nativeEvent.text })
  };

  _loginAttempt = () => {
    this.setState({ loggingIn: true });
    this._executeQuery(this._getLoginInfo())
  }

  _getLoginInfo = () => {
    return {
      email: this.state.emailInput,
      pass: this.state.passwordInput
    };
  }

  _executeQuery = (query) => {
    fetch('https://yourtakeout.ie/longboard_api/test.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this._checkResponse(responseJson);
      return responseJson;
    })
    .catch((error) => {
      console.error(error);
    });
  };

  _checkResponse = (response) => {
    if (response.isOk) {
      this._saveDeviceInfo(response.deviceInfo);
      this._viewSkateSessions();
    }
  }

  _saveDeviceInfo = async (deviceInfo) => {
    try {
      await AsyncStorage.setItem('deviceName', deviceInfo.deviceName);
      await AsyncStorage.setItem('devicePass', deviceInfo.devicePass);
    } catch (error) {
      console.log(error.message);
    }
  }

  _viewSkateSessions = () => {
    this.setState({loggingIn: false});
    this.props.navigation.navigate('Sessions', {});
  }

  render() {
    const spinner = this.state.loggingIn ? <ActivityIndicator style={styles.spinner} size='large' /> : null;
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={this.state.emailInput}
          onChange={this._onEmailTextChanged}
          underlineColorAndroid={'transparent'}
          placeholder='Email'
          placeholderTextColor='#ccc'
        />
        <TextInput
          style={styles.input}
          value={this.state.passwordInput}
          onChange={this._onPasswordTextChanged}
          underlineColorAndroid={'transparent'}
          secureTextEntry={true}
          placeholder='Password'
          placeholderTextColor='#ccc'
        />
        <TouchableOpacity
          onPress={this._loginAttempt}
          style={styles.loginButton}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        {spinner}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#555',
    flex: 1
  },
  input: {
    height: 36,
    padding: 4,
    paddingLeft: 8,
    margin: 5,
    marginTop: 20,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#a2c2d8',
    borderRadius: 8,
    color: '#48BBEC'
  },
  loginButton: {
    backgroundColor: '#a2c2d8',
    padding: 10,
    marginTop: 20,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 4,
    alignItems: 'center'
  },
  loginButtonText: {
    color: '#555',
    fontWeight: 'bold',
    fontSize: 18
  },
  spinner: {
    marginTop: 10
  }
})
