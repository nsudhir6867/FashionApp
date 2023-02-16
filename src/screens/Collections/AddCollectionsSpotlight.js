import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {FAB} from 'react-native-paper';
import {Select, Toast, Box} from 'native-base';
import SpinnerBackdrop from '../../components/UI/SpinnerBackdrop';
import {ActionSheetCustom as ActionSheet} from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {verifyEmail} from '../../shared/miscellaneous';
// import HeaderBack from '../../../../components/HeaderBack';
import HeaderBack from '../../components/UI/BackButton';
import InputText from '../../components/UI/InputText';
import Button from '../../components/UI/Button';
import {uploadimage, createUpdateUserPost} from '../../services/api.fuctions';
import {checkValidity} from '../../shared/utility';
// import DropDown from '../../../../components/DropDown';
import Selection from '../../components/Selection';
import CheckBox from '@react-native-community/checkbox';

const options = [
  'Cancel',
  <View>
    <Text style={{color: 'black'}}>Gallery</Text>
  </View>,
  <View>
    <Text style={{color: 'black'}}>Camera</Text>
  </View>,
];

class AddCollectionSpotlight extends Component {
  state = {
    data: [],
    photo: '',
    loading: false,
    targetCollectionItem: {},
    base64: '',
    filename: 'image',
    imagepath: '',
    value: null,
    items: [],
    collectionName: {
      value: '',
      isItValid: false,
      rules: {
        required: true,
      },
      validationErrorMsg: '',
    },
    link: {
      value: '',
      isItValid: false,
      rules: {
        required: true,
      },
      validationErrorMsg: '',
    },
    isSpotlight: false,
    isClosetFalse: false,
  };

  inputChangeHandler = (inputName, text) => {
    this.setState(previousState => ({
      [inputName]: {
        ...previousState[inputName],
        value: text,
      },
    }));
  };

  dropDownSelectHandler = item => {
    this.setState({
      targetCollectionItem: item,
    });
    console.log(item);
    console.log(this.state, 'Helo');
  };

  checkValidityHandler = (value, rules, inputName) => {
    let {isValid, errorMsg} = checkValidity(value, rules);
    if (!isValid) {
      if (inputName === 'collectionName') {
        errorMsg = 'Collection Name is required';
      } else {
        errorMsg = 'Purchase link is required';
      }
      this.setState(previousState => ({
        [inputName]: {
          ...previousState[inputName],
          isItValid: false,
          validationErrorMsg: `${errorMsg}`,
        },
      }));
    } else {
      this.setState(previousState => ({
        [inputName]: {
          ...previousState[inputName],
          isItValid: true,
          validationErrorMsg: '',
        },
      }));
    }
    // console.log(this.state, 'Inside Validaton');
  };

  componentDidMount() {
    const {navigation} = this.props;
    // console.log(navigation);
    // this._unsubscribe = navigation.addListener('focus', async () => {
    //   this.GetImage();
    // });
    console.log(this.props.auth.userToken, 'in Did Mount');
  }

  componentWillUnmount() {
    console.log('in WillUnmount');
    // this._unsubscribe;
  }

  // GetImage = async () => {
  //   this.setState({
  //     photo: await AsyncStorage.getItem('imagepath'),
  //   });
  // };

  Validation = () => {
    let cancel = false;
    const {name, email, imagepath} = this.state;
    if (name.length === 0) {
      cancel = true;
    }
    if (email.length === 0) {
      cancel = true;
    }

    if (cancel) {
      this.showerrorMessage('Fields can not be empty');
      return false;
    } else {
      return true;
    }
  };

  ImageValidation = () => {
    let cancel = false;
    if (!this.state.imagepath) {
      cancel = true;
    }
    if (cancel) {
      this.showerrorMessage('Upload Image');
      return false;
    } else {
      return true;
    }
  };

  checkboxValidation = () => {
    let cancel = true;
    if (this.state.isCloset || this.state.isSpotlight) {
      cancel = false;
    }
    if (cancel) {
      this.showerrorMessage('You must select at least one checkbox');
      return false;
    } else {
      return true;
    }
  };

  checkOverallFormValidity = () => {
    let invalid = false;
    if (
      this.state.collectionName.value.trim() === '' &&
      this.state.link.value.trim() === ''
    ) {
      invalid = true;
    }
    if (invalid) {
      this.showerrorMessage('Please provide both colletion name and link');
      return false;
    } else {
      return true;
    }
  };

  createUserPost = async () => {
    const {imagepath} = this.state;
    if (
      this.ImageValidation() &&
      this.checkboxValidation() &&
      this.checkOverallFormValidity()
    ) {
      this.setState({
        loading: true,
      });
      console.log(this.state, 'hereeeeee');
      let data = JSON.stringify({
        UP_ImageName: this.state.filename,
        UP_ImagePath: this.state.imagepath,
        UP_AddSpotlight: this.state.isSpotlight,
        UP_Closet: this.state.isCloset,
        UP_Product_URL: this.state.link.value,
        UP_Coll_Desc: this.state.collectionName.value,
        UP_IsFirst: true,
        UP_Number: 1,
        UP_UC_PKeyID: this.state.targetCollectionItem.value,
        UP_IsActive: 1,
        UP_IsDelete: 0,
        UP_Show: 1,
        Type: 1,
      });
      try {
        console.log(data, 'profile');

        const res = await createUpdateUserPost(data, this.props.auth.userToken);
        console.log('ProfileRes:', res);
        if (!res) {
          this.showerrorMessage('Failed to add!');
        } else {
          this.showMessage('Collection saved successfully!');
          this.setState(prevState => ({
            ...prevState,
            imagepath: '',
            isSpotlight: false,
            isClosetFalse: false,
            collectionName: {
              value: '',
              isItValid: false,
              rules: {
                required: true,
              },
              validationErrorMsg: '',
            },
            link: {
              value: '',
              isItValid: false,
              rules: {
                required: true,
              },
              validationErrorMsg: '',
            },
            isSpotlight: false,
            isClosetFalse: false,
          }));
          // this.props.navigation.navigate('Profiles');
        }
        this.setState({
          loading: false,
        });
      } catch (error) {
        this.showerrorMessage(error.response.data.error_description);
      }
    }
  };

  showerrorMessage = message => {
    if (message !== '' && message !== null && message !== undefined) {
      Toast.show({
        title: message,
        placement: 'bottom',
        status: 'error',
        duration: 5000,
        backgroundColor: '#EBD4BD',
      });
    }
  };

  showMessage = message => {
    if (message !== '' && message !== null && message !== undefined) {
      Toast.show({
        title: message,
        placement: 'bottom',
        status: 'success',
        duration: 5000,
        backgroundColor: '#EBD4BD',
      });
    }
  };

  warningMessage = message => {
    if (message !== '' && message !== null && message !== undefined) {
      Toast.show({
        title: message,
        placement: 'bottom',
        status: 'warning',
        duration: 5000,
        backgroundColor: '#EBD4BD',
      });
    }
  };

  onOpenImage = () => this.ActionSheet.show();

  ImageGallery = async () => {
    setTimeout(() => {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        includeBase64: true,
        multiple: false,
        compressImageQuality: 0.5,
      }).then(image => {
        console.log(image);
        if (image.data) {
          this.setState(
            {
              base64: image.data,
              filename:
                Platform.OS === 'ios' ? image.filename : 'image' + new Date(),
              // imagepath: image.path,
            },
            () => {
              this.uploadImage();
            },
          );
        }
      });
    }, 700);
  };

  ImageCamera = async () => {
    setTimeout(() => {
      ImagePicker.openCamera({
        width: 400,
        height: 400,
        cropping: true,
        includeBase64: true,
        multiple: false,
        compressImageQuality: 1,
      }).then(image => {
        console.log(image);
        if (image.data) {
          this.setState(
            {
              base64: image.data,
              filename:
                Platform.OS === 'ios' ? image.filename : 'image' + new Date(),
              // imagepath: image.path,
            },
            () => {
              this.uploadImage();
            },
          );
        }
      });
    }, 700);
  };

  uploadImage = async () => {
    this.setState({loading: true});
    const {base64} = this.state;
    let data = JSON.stringify({
      Type: 2,
      Image_Base: 'data:image/png;base64, ' + base64,
    });
    console.log('data:image/png;base64, ' + base64);
    try {
      console.log(this.props.auth.userToken, 'in upload image');
      const res = await uploadimage(data, this.props.auth.userToken);
      console.log(res[0].Image_Path, 'resssss');

      this.setState({
        imagepath: res[0].Image_Path,
      });
      this.setState({loading: false});
    } catch (error) {
      if (error.request) {
        console.log(error.request);
      } else if (error.responce) {
        console.log(error.responce);
      } else {
        console.log(error);
      }
    }
  };

  render() {
    console.log('in render');
    return (
      <View style={{flex: 1, backgroundColor: '#593714'}}>
        <SpinnerBackdrop showModal={this.state.loading} />
        <ScrollView
          style={{
            width: '100%',
            flex: 1,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            alignSelf: 'center',
            backgroundColor: 'white',
          }}>
          <View style={{alignSelf: 'center', marginTop: 30}}>
            <Image
              style={{
                width: Dimensions.get('window').width / 1.16,
                height: Dimensions.get('window').width / 1.16,
                borderRadius: 10,
              }}
              resizeMode="cover"
              source={{
                //   uri: imagepath ? imagepath : null,
                uri: this.state.imagepath
                  ? this.state.imagepath
                  : 'https://www.unigreet.com/wp-content/uploads/2020/04/Dp-pic-download-833x1024.jpg',
              }}
            />
            <FAB
              icon="camera"
              style={{
                elevation: 1,
                position: 'absolute',
                top: Dimensions.get('window').width / 1.5,
                left: Dimensions.get('window').width / 1.5,
                backgroundColor: 'white',
              }}
              onPress={() => this.onOpenImage()}
            />
          </View>

          <ActionSheet
            ref={o => (this.ActionSheet = o)}
            title={
              <Text style={{color: '#000', fontSize: 18, fontWeight: 'bold'}}>
                Profile Photo
              </Text>
            }
            options={options}
            cancelButtonIndex={0}
            destructiveButtonIndex={4}
            useNativeDriver={true}
            onPress={index => {
              if (index === 0) {
                // cancel action
              } else if (index === 1) {
                this.ImageGallery();
              } else if (index === 2) {
                this.ImageCamera();
              }
            }}
          />

          <View style={styles.form_container}>
            <View style={styles.checkboxContainer}>
              <CheckBox
                tintColors={{true: '#CDAF90', false: '#CDAF90'}}
                value={this.state.isSpotlight}
                boxType="square"
                onCheckColor="#CDAF90"
                onTintColor="#CDAF90"
                onValueChange={() => {
                  this.setState(prev => ({
                    isSpotlight: !prev.isSpotlight,
                  }));
                }}
                style={styles.checkbox}
              />
              <Text style={styles.label}>Spotlight</Text>
            </View>
            <View style={styles.checkboxContainer}>
              <CheckBox
                tintColors={{true: '#CDAF90', false: '#CDAF90'}}
                value={this.state.isCloset}
                onCheckColor="#CDAF90"
                onTintColor="#CDAF90"
                boxType="square"
                onValueChange={() =>
                  this.setState(prev => ({
                    isCloset: !prev.isCloset,
                  }))
                }
                style={styles.checkbox}
              />
              <Text style={styles.label}>Closet</Text>
            </View>
            {this.state.isCloset ? (
              <Selection
                changeHandler={this.dropDownSelectHandler}
                style={{width: '100%', alignSelf: 'center'}}
              />
            ) : null}
            <InputText
              label="Collection Name"
              onChangeText={text =>
                this.inputChangeHandler('collectionName', text)
              }
              placeholder="Enter your collection name"
              value={this.state.collectionName.value}
              errorMsg={this.state.collectionName.validationErrorMsg}
              onBlur={() => {
                this.checkValidityHandler(
                  this.state.collectionName.value,
                  this.state.collectionName.rules,
                  'collectionName',
                );
              }}
            />
            {!this.state.isCloset && (
              <InputText
                label="From Where to Purchase"
                onChangeText={text => this.inputChangeHandler('link', text)}
                value={this.state.link.value}
                errorMsg={this.state.link.validationErrorMsg}
                placeholder="Enter purchase link"
                onBlur={() => {
                  this.checkValidityHandler(
                    this.state.link.value,
                    this.state.link.rules,
                    'link',
                  );
                }}
              />
            )}

            <View
              style={{
                marginTop: 30,
              }}>
              <Button
                // onPress={registerUser}
                style={{marginBottom: 140, height: 55}}
                onPress={() => this.createUserPost()}
                text="Save Collection"
                // disabled={!isFormValid}
                backgroundColor="#5B4025"
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  form_container: {
    flex: 1,
    marginHorizontal: 'auto',
    width: '86%',
    marginHorizontal: 'auto',
    marginTop: 20,
    alignSelf: 'center',
  },
  login_header: {
    color: 'black',
    fontSize: 32,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginRight: 10,
    marginVertical: 5,
  },
  checkbox: {
    alignSelf: 'center',
    marginLeft: -5,
    width: 20,
    height: 20,
  },
  label: {
    marginHorizontal: 10,
    color: '#264653',
    fontSize: 15,
  },
});

function mapStateToProps(state) {
  // const data = state;
  console.log(state.auth, 'state');
  return {auth: state.auth};
}

export default connect(mapStateToProps, {})(AddCollectionSpotlight);
