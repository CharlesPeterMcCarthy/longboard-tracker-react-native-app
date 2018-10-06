'use strict';

import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  AsyncStorage,
  BackHandler
} from 'react-native';
import { styles } from '../styles/Login';

type Props = {};
export default class Login extends Component<Props> {
  static navigationOptions = {
    title: 'Login',
    headerLeft: null,
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
      passwordInput: '',
      error: false,
      errorMsg: ''
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
    fetch('{{ API_URL }}', {
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
      if (response.validLogin) this._saveDeviceInfo(response.deviceInfo);
      else if (!response.validLogin || !response.emailExists) this.setState({ error: true, errorMsg: response.displayError });
    }

    this.setState({ loggingIn: false });
  }

  _saveDeviceInfo = async (deviceInfo) => {
    try {
      await AsyncStorage.setItem('loggedIn', "true");
      await AsyncStorage.setItem('deviceName', deviceInfo.deviceName);
      await AsyncStorage.setItem('devicePass', deviceInfo.devicePass);
      await AsyncStorage.setItem('deviceID', `${deviceInfo.deviceID}`);

      await this._viewSkateSessions();
    } catch (error) {
      console.log(error.message);
    }
  }

  _viewSkateSessions = () => {
    this.setState({loggingIn: false, emailInput: '', passwordInput: ''});
    this.props.navigation.navigate('Sessions', {});
  }

  render() {
    const spinner = this.state.loggingIn ? <ActivityIndicator style={styles.spinner} size='large' /> : null;
    const error = this.state.error ? (
      <View>
        <Text style={styles.error}>{this.state.errorMsg}</Text>
      </View>
    ) : null;

    return (
      <View style={styles.container}>
        {error}
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
        autoCapitalize='none'
      />
    );
  }
}
