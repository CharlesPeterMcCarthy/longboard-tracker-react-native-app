import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
  },
  error: {
    color: 'white',
    backgroundColor: 'red',
    margin: 5,
    marginTop: 10,
    padding: 5,
    textAlign: 'center',
    fontWeight: 'bold'
  }
})
