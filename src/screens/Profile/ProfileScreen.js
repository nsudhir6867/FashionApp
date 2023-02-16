import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, Platform} from 'react-native';
import {useSelector} from 'react-redux';
import {getUserPost} from '../../services/api.fuctions';
import Selection from '../../components/Selection';
import ProfileImages from '../../components/ProfileImages';
import ProfileAdd from '../../components/ProfileAdd';

const ProfileScreen = props => {
  const [selectedItem, setSelectedItem] = useState({});
  const [allPosts, setAllPosts] = useState([]);
  // console.log(!!selectedItem.value, 'checking');
  const dropDownSelectHandler = item => {
    setSelectedItem(item);
    console.log(item);
    console.log(selectedItem, 'Hii');
  };

  const userToken = useSelector(state => state.auth.userToken);
  const userDetails = useSelector(state => state.auth);
  console.log(userDetails);
  useEffect(() => {
    // console.log(props.route, 'hereeeee');
    console.log('I am here');
    getAllUserPost();
  }, [selectedItem]);

  // useEffect(() => {
  //   // console.log(props.route, 'hereeeee');
  //   console.log('I am here');
  //   getAllUserPost();
  // }, []);

  const getAllUserPost = useCallback(async () => {
    // console.log(props.route.params.collectionItem.value, 'Id is here');
    // console.log(!!selectedItem, 'SelectedItem is here');
    let data = JSON.stringify({
      // UP_COLL_PKeyID: selectedItem.value,
      Type: 8,
    });
    if (!!selectedItem.value === true) {
      console.log('true');
      data = JSON.stringify({
        UP_COLL_PKeyID: selectedItem.value,
        Type: 5,
      });
    }
    // const data = JSON.stringify({
    //   // UP_COLL_PKeyID: selectedItem.value,
    //   Type: 8,
    // });
    console.log(data, 'profile screen send data is here');
    await getUserPost(data, userToken)
      .then(res => {
        const posts = res.data;
        // console.log(posts);
        console.log(posts[0], ' post is hereeee');
        const postImages = posts[0]?.map(item => {
          // console.log(item.UP_ImagePath, 'Item...');
          return {url: item.UP_ImagePath, id: item.UP_PKeyID};
        });
        // console.log(postImages, 'PostImages');
        setAllPosts(postImages);
      })
      .catch(error => {
        console.log(error, 'getPost');
      });
  });

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        paddingTop: 20,
        backgroundColor: 'white',
        marginBottom: -10,
      }}>
      <View
        style={{
          marginTop: 20,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ProfileAdd />
      </View>
      <View
        style={{
          marginTop: 20,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Selection
          changeHandler={dropDownSelectHandler}
          value={selectedItem?.value}
        />
      </View>
      <Text style={{alignSelf: 'center', color: '#264653', fontSize: 25}}>
        {selectedItem.label}
      </Text>
      <ProfileImages allImages={allPosts} />
    </View>
  );
};

export default ProfileScreen;
