import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import PostComponent from '../../components/PostComponent'; 
import PostCommercantComponent from '../../components/PostCommercantComponent'; // Ensure this component is correctly imported
import EditActions from '../../components/EditActionsComponent.js';
import MessageModal from '../../components/MessageModal.js';

const CommunauteForumPage = () => {
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();
  const [selectedPost, setSelectedPost] = useState(null);
  const [user, setUser] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [postComponentVisible, setPostComponentVisible] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [inputHeight, setInputHeight] = useState(0); 
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [blurEffect, setBlurEffect] = useState(false);


  const adjustInputHeight = (event) => {
    setInputHeight(event.nativeEvent.contentSize.height);
  };

  const handleLongPressOnPost = (post) => {
    setSelectedPost(post);
    setEditModalVisible(true);
    setPostComponentVisible(true);
    setBlurEffect(true);
  };

  const renderSelectedPost = () => {
    if (!selectedPost || !blurEffect) return null;
    return (
      <View>
        <View style={styles.selectedPostContainer}>
          {postComponentVisible && (
            <PostComponent
              post={selectedPost}
              onPostPress={() => {}}
              onLongPress={() => {}}
            />
          )}
          {editModalVisible && (
            <EditActions
              onClose={() => {
                setEditModalVisible(false);
                setPostComponentVisible(false);
              }}
              onEdit={() => {
                setEditModalVisible(false);
                setPostComponentVisible(false); 
                setMessageText(selectedPost.contenu);
                setMessageModalVisible(true);
              }}
              onDelete={() => {
                setEditModalVisible(false);
                setPostComponentVisible(false);
                deletePost(selectedPost.idPublication);
              }}
            />
          )}
        </View>
        <MessageModal
          isModalVisible={messageModalVisible}
          closeModal={() => {
            setMessageModalVisible(false);
            setEditModalVisible(false); 
            setPostComponentVisible(false);
            setBlurEffect(false); 
            setSelectedPost(null);
          }}
          messageText={messageText}
          setMessageText={setMessageText}
          sendMessage={() => {
            modifyPost(selectedPost.idPublication, messageText);
            setMessageModalVisible(false);
            setPostComponentVisible(false);
            setEditModalVisible(false); 
            setBlurEffect(false);
            setSelectedPost(null); 
          }}
          adjustInputHeight={adjustInputHeight}
          inputHeight={inputHeight}
        />
      </View>
    );
  };

  const fetchPosts = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('User Not Found', 'No user ID found in storage');
        return;
      }
      
      const userDataResponse = await axios.get(`http://10.0.2.2:4000/api/user/${userId}`);
      const userData = userDataResponse.data;
      setUser(userData);

      const postsUserResponse = await axios.get(`http://10.0.2.2:4000/api/publicationUser/equipe/${userData.Equipe.idEquipe}`);
      const postsCommercantResponse = await axios.get(`http://10.0.2.2:4000/api/publicationCommercant/equipe/${userData.Equipe.idEquipe}`);

      const postsUser = postsUserResponse.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      const postsCommercant = postsCommercantResponse.data;

      const combinedPosts = interleavePosts(postsUser, postsCommercant);
      setPosts(combinedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('Error', 'An error occurred while fetching posts');
    }
  };

  
  const modifyPost = async (idPublication, newContent) => {
    const updatedPost = {
      contenu: newContent,
      date: new Date().toISOString(), 
    };
  
    try {
      await axios.put(`http://10.0.2.2:4000/api/publicationUser/${idPublication}`, updatedPost);
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      Alert.alert('Error', 'An error occurred while updating the post');
    }
  };

  const deletePost = async (idPublication) => {
    try {
      await axios.delete(`http://10.0.2.2:4000/api/publicationUser/${idPublication}`);
      fetchPosts();
    } catch (error) {
      console.error('Error delete post', error);
      return false; 
    }
  };

  const disableBlurAndEditModal = () => {
    setBlurEffect(false);
    setEditModalVisible(false);
    setPostComponentVisible(true);
    setSelectedPost(null);
    renderSelectedPost();
  };


  const renderBlurOverlay = () => (
    <TouchableOpacity
      style={[styles.blurOverlay, { display: blurEffect ? 'flex' : 'none' }]}
      onPress={disableBlurAndEditModal} 
      activeOpacity={1}
    />
  );

  useEffect(() => {
    fetchPosts();
  }, []);

  const interleavePosts = (postsUser, postsCommercant) => {
    const result = [];
    let commercantIndex = 0;
    postsUser.forEach((post, index) => {
      result.push(post);
      if ((index + 1) % 3 === 0 ) {
        result.push(postsCommercant[commercantIndex++]);
      }
      else if ((index + 1) % 2 === 0 ) {
        result.push(postsCommercant[commercantIndex++]);
      }
        else  if ((index + 1) % 1 === 0 ) {
            result.push(postsCommercant[commercantIndex++]);
          }
    });
    return result;
  };

  const isPostCommercant = (post) => {
    return post.hasOwnProperty('idCommercant'); 
  };

  return (
    <View style={styles.container}>
         {renderBlurOverlay()}
        {renderSelectedPost()}
      <ScrollView style={styles.scrollView}>
        <View style={styles.view}>
          {posts.map((post, index) => isPostCommercant(post) ? (
            <PostCommercantComponent key={`commercant-${index}`} post={post} />
          ) : (
            <PostComponent
              key={`user-${index}`}
              post={post}
              onPostPress={() => navigation.navigate('PostDetails', { post })}
              onLongPress={() => user.idUser === post.idUser ? handleLongPressOnPost(post) : null}
              showDetails={true}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#D9D9D9"
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  view: {
    margin: "3%"
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1, 
  },
  selectedPostContainer: {
    position: 'absolute',
    zIndex: 2, 
    width: '90%',
    alignSelf: "center",
    marginTop: "10%"
  }
});

export default CommunauteForumPage;
