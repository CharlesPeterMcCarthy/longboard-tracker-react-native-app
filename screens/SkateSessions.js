'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
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

    if (response.isOk) this.setState({ sessions: response.sessions });
    else this.setState({ error: true, errorMsg: response.displayError });
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#a2c2d8',
    flex: 1
  },
  spinner: {
    marginTop: 20
  },
  sessionList: {
    marginTop: 5,
  },
  sessionPanel: {
    padding: 10,
    marginHorizontal: 5,
    marginVertical: 2,
    borderRadius: 4,
    backgroundColor: '#555'
  },
  timeAgo: {
    textAlign: 'right'
  },
  sessionHeader: {
    flexDirection: 'row',
    flex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: '#a2c2d8',
    paddingBottom: 10,
    marginBottom: 10
  },
  times: {
    marginTop: 10
  },
  detail: {
    color: '#CCC'
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFF'
  },
  deviceName: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5
  },
  deviceWord: {
    fontWeight: 'normal'
  }
})
