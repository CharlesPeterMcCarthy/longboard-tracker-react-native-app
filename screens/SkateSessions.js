'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  AsyncStorage,
  BackHandler,
  ActivityIndicator,
  Button,
  FlatList,
  TouchableNativeFeedback
} from 'react-native';
import moment from 'moment';
import OptionsPopup from '../components/OptionsPopup';
import { styles } from '../styles/SkateSessions';

type Props = {};
export default class SkateSessions extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Skate Sessions',
      headerLeft: null,
      headerRight: (
        <OptionsPopup text={"More"} actions={['Refresh', 'Logout']} onPress={(eventName, index) => {
          if (index === 0) {
            navigation.state.params.refreshSessions();
          } else if (index === 1) {
            AsyncStorage.multiRemove(['loggedIn', 'deviceID', 'deviceName', 'devicePass'], (err) => {
              navigation.navigate('Login')
            });
          }
        }} />
      ),
      headerStyle: {
        backgroundColor: '#555'
      },
      headerTitleStyle: {
        color: '#a2c2d8'
      }
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      gettingSessions: false,
      initialLoad: false,
      errorMsg: '',
      error: false,
      sessions: [],
      deviceID: 0,
      deviceName: '',
      lastSessionID: 0
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      refreshSessions: this._getSessions.bind(this)
    });
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });

    this._getDeviceInfo();
  }

  _getDeviceInfo = async () => {
    const deviceID = await AsyncStorage.getItem('deviceID');
    const deviceName = await AsyncStorage.getItem('deviceName');
    this.setState({ deviceID, deviceName }, () => {
      this._getSessions();
    });
  }

  _getSessions = () => {
    this.setState({ gettingSessions: true });

    fetch('{{ API_URL }}', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        deviceID: this.state.deviceID,
        lastSessionID: this.state.lastSessionID
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this._checkResponse(responseJson)
      return responseJson
    })
    .catch((error) => console.error(error))
  }

  _checkResponse(response) {
    this.setState({ gettingSessions: false });

    if (response.isOk && response.sessions) {
      if (!this.state.initialLoad) {
        this.setState({ sessions: response.sessions, lastSessionID: response.sessions[0].sessionID, initialLoad: true });
      } else {
        response.sessions.reverse().forEach(session => {
          this.setState(prevState => ({ sessions: [session, ...prevState.sessions], lastSessionID: session.sessionID }));
        })
      }
    } else if (!response.isOk) this.setState({ error: true, errorMsg: response.displayError });
  }

  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({item, index}) => {
    return  (
      <SessionPanel
        item={item}
        index={index}
        onPressItem={this._viewSession}
      />
    );
  }

  _viewSession = (index) => {
    this.props.navigation.navigate('Session', { session: this.state.sessions[index] });
  }

  render() {
    const spinner = this.state.gettingSessions ? <ActivityIndicator style={styles.spinner} size='large' /> : null;
    const error = this.state.error ? (
      <View>
        <Text>{this.state.errorMsg}</Text>
      </View>
    ) : null;

    return (
      <View style={styles.container}>
        {spinner}
        {error}
        <Text style={styles.deviceName}><Text style={styles.deviceWord}>Device:</Text> {this.state.deviceName}</Text>
        <FlatList
          data={this.state.sessions}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          style={styles.sessionList}
        />
      </View>
    );
  }
}

class SessionPanel extends Component<Props> {
  _onPress = () => {
    this.props.onPressItem(this.props.index);
  }

  render() {
    const item = this.props.item;
    const timeAgo = moment(item.end).fromNow();
    const timeBetween = moment.duration(moment(item.end).diff(moment(item.start)));
    const skateLength = Math.floor(timeBetween.asMinutes()) + " minutes " + (timeBetween.asSeconds() % 60) + " seconds";

    return (
      <TouchableNativeFeedback
        onPress={this._onPress}>
        <View style={styles.sessionPanel}>
          <View style={styles.sessionHeader}>
            <View style={{flex:1}}>
              <Text style={styles.headerText}>#{item.sessionID}</Text>
            </View>
            <View style={{flex:1}}>
              <Text style={[styles.timeAgo, styles.headerText]}>{timeAgo}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.detail}>Skate Distance: {item.distance} KM</Text>
            <Text style={styles.detail}>Skate Length: {skateLength}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }
}
