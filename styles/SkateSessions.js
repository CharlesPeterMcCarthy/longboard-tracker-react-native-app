import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
