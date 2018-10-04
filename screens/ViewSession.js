'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  AsyncStorage,
  BackHandler,
  ActivityIndicator
} from 'react-native';
import { AreaChart, Grid, YAxis, XAxis} from 'react-native-svg-charts'
import * as shape from 'd3-shape';
import moment from 'moment';

type Props = {};
export default class SkateSessions extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
    return {
      title: `Session #${navigation.state.params.session.sessionID}`,
      headerStyle: {
        backgroundColor: '#555'
      },
      headerTitleStyle: {
        color: '#a2c2d8'
      },
      headerTintColor: 'white'
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      gettingSessionInfo: false,
      errorMsg: '',
      error: false,
      speeds: []
    }
  }

  componentWillMount() {
    this._getSession();
  }

  _getSession = () => {
    this.setState({ gettingSessionInfo: true });

    fetch('https://yourtakeout.ie/longboard_api/test3.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sessionID: this.props.navigation.state.params.session.sessionID })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this._checkResponse(responseJson)
      return responseJson
    })
    .catch((error) => console.error(error))
  }

  _checkResponse(response) {
    this.setState({ gettingSessionInfo: false })

    if (response.isOk) this.setState({ speeds: response.speeds });
    else this.setState({ error: true, errorMsg: response.displayError });
  }

  _getTopSpeed = () => {
    const speeds = this.state.speeds;
    let topSpeed = speeds[0];
    speeds.forEach(speed => { if (speed > topSpeed) topSpeed = speed });

    return topSpeed;
  }

  render() {
    const spinner = this.state.gettingSessionInfo ? <ActivityIndicator style={styles.spinner} size='large' /> : null;
    const error = this.state.error ? (
      <View>
        <Text>{this.state.errorMsg}</Text>
      </View>
    ) : null;
    const session = this.props.navigation.state.params.session;
    const timeBetween = moment.duration(moment(session.end).diff(moment(session.start)));
    const skateLength = Math.floor(timeBetween.asMinutes()) + " minutes " + (timeBetween.asSeconds() % 60) + " seconds.";
    const timeAgo = moment(session.end).fromNow();
    const topSpeed = this._getTopSpeed();

    const sessionDetails = {
      topSpeed,
      distance: session.distance,
      start: session.start,
      end: session.end,
      skateLength,
      timeAgo
    }

    return (
      <View style={styles.container}>
        {spinner}
        {error}

        <Text style={styles.title}>Speed Graph</Text>
        <SpeedGraph speeds={this.state.speeds}/>
        <SessionDetails details={sessionDetails}/>
      </View>
    );
  }
}

class SpeedGraph extends Component<Props> {

  _calculateYAxis = (value, index) => {
    const count = this.props.speeds.length;
    const interval = Math.ceil(count / 10);
    if (index % interval == 0 || index == count - 1) {
      return (index + 1) * 2
    }
  }

  render() {
    const speeds = this.props.speeds;

    return (
      <View style={{ height: 200, flexDirection: 'row' }}>
        <YAxis
          data={ speeds }
          contentInset={{ top: 30, bottom: 5, left: 5, right: 5 }}
          svg={{ fontSize: 10, fill: 'grey' }}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <AreaChart
            style={styles.lineChart}
            data={ speeds }
            contentInset={{ top: 30, left: 5, right: 5 }}
            curve={ shape.curveNatural }
            svg={{ fill: '#777' }}
          >
            <Grid/>
          </AreaChart>
          <XAxis
            style={{ marginHorizontal: -20, marginTop: 5, height: 30 }}
            data={ speeds }
            formatLabel={this._calculateYAxis}
            contentInset={{ top: 30, bottom: 5, left: 25, right: 25}}
            svg={{ fontSize: 10, fill: 'grey' }}
          />
        </View>
      </View>
    );
  }
}

class SessionDetails extends Component<Props> {
  render() {
    const details = this.props.details;
    const date = moment(details.end).format('LL');
    const startTime = moment(details.start).format('HH.mm A');
    const endTime = moment(details.end).format('HH.mm A');

    return (
      <View style={{marginTop: 30}}>
        <Text style={[styles.title, {marginBottom: 10}]}>Details</Text>
        <Text style={styles.detail}>Skate Distance: {details.distance} KM</Text>
        <Text style={styles.detail}>Skate Length: {details.skateLength}</Text>
        <Text style={styles.detail}>Top Speed: {details.topSpeed} KM/H</Text>
        <Text style={styles.detail}>Date: {date} ({details.timeAgo})</Text>
        <Text style={styles.detail}>Started at {startTime}</Text>
        <Text style={styles.detail}>Finished at {endTime}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  spinner: {
    marginTop: 20
  },
  container: {
    backgroundColor: '#a2c2d8',
    flex: 1,
    padding: 10
  },
  lineChart: {
    height: 200,
    backgroundColor: '#CCC',
    marginTop: 5
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5
  },
  detail: {
    backgroundColor: '#CCC',
    padding: 6,
    marginBottom:2,
    borderRadius: 4
  }
})
