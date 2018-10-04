import React, { Component, PropTypes } from 'react';
import { View, Text, UIManager, findNodeHandle, TouchableOpacity } from 'react-native';

export default class PopupMenu extends Component {
  constructor (props) {
    super(props);

    this.state = {
      icon: null
    }
  }

  _onError () {
    console.log('Popup Error')
  }

  _onPress = () => {
    if (this.state.icon) {
      UIManager.showPopupMenu(
        findNodeHandle(this.state.icon),
        this.props.actions,
        this._onError,
        this.props.onPress
      );
    }
  }

  _onRef = icon => {
    if (!this.state.icon) {
      this.setState({icon});
    }
  }

  render () {
    return (
      <View>
        <TouchableOpacity onPress={this._onPress}>
          <Text
            style={{marginRight:15, color: '#FFF', fontWeight: 'bold'}}
            ref={this._onRef}
          >{this.props.text}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
