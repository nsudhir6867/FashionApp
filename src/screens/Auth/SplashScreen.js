import React, {Component} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  Dimensions,
  AppState,
} from 'react-native';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {BubblesLoader} from 'react-native-indicator';
const {width, height} = Dimensions.get('window');
const delay = 5;

export default class SplashScreen extends Component {
  // useEffect(() => {
  //   let timer1 = setTimeout(() => navigation.navigate('Login'), 1000);
  //   return () => {
  //     clearTimeout(timer1);
  //   };
  // }, []);
  constructor(props) {
    super(props);
    this.state = {
      appState: 'active',
    };
  }

  _getInitialUrl = async () => {
    const url = dynamicLinks().onLink(this.handleDynamicLink);
    console.log(url, 'url');
    this.setState({
      linkdata: url,
    });
  };
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = async nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this._getInitialUrl();
    }
  };
  handleDynamicLink = link => {
    this.props.navigation.navigate('ResetPasswordScreen', {link: link.url});
  };

  substring = () => {
    console.log(this.state.linkdata, 'substring');
  };
  componentDidMount = async () => {
    setTimeout(() => {
      this.props.navigation.navigate('LoginScreen');
    }, 1000);
    this._getInitialUrl();
    this.substring();
    AppState.addEventListener('change', this._handleAppStateChange);
    await dynamicLinks()
      .getInitialLink()
      .then(link => {
        if (link) {
          console.log('Loginlink', link);
          this.props.navigation.navigate('ResetPasswordScreen', {
            link: link.url,
          });
        }
        console.log('Loginlinklink', link);
      });
  };

  render() {
    return (
      <SafeAreaView>
        {/* <Animated.Image
          source={require('../../assets/Image/Logo.png')}
          style={{
            width: '90%',
            height: '100%',
            resizeMode: 'contain',
            alignSelf: 'center',
            justifyContent: 'center',
          }}
        />
        <Animated.View
          style={{
            width: width,
            height,
            position: 'absolute',
            zIndex: -1,
          }}
        /> */}
        <View
          style={{
            width: '100%',
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 50,
          }}>
          <BubblesLoader size={50} color="black" dotRadius={10} />
        </View>
      </SafeAreaView>
    );
  }
}
