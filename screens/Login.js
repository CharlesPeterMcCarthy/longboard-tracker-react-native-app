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
  AsyncStorage,
  BackHandler
} from 'react-native';

type Props = {};
export default class Login extends Component<Props> {
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

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
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
    fetch('{{API_URL}}', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query),
    })
    .then((response) => response.json())
    .then((responseJson) => {
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
      await AsyncStorage.setItem('loggedIn', "true");
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
        <InputField
          value={this.state.emailInput}
          handler={this._onEmailTextChanged}
          placeholder='Email'
        />
        <InputField
          value={this.state.passwordInput}
          handler={this._onPasswordTextChanged}
          placeholder='Password'
          secure={true}
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

class InputField extends Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TextInput
        style={styles.input}
        value={this.props.value}
        onChange={this.props.handler}
        underlineColorAndroid={'transparent'}
        placeholder={this.props.placeholder}
        placeholderTextColor='#ccc'
        secureTextEntry={this.props.secure}
      />
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