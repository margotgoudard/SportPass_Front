import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import PostComponentForum from '../../components/PostComponentForum'; 
import PostCommercantComponent from '../../components/PostCommercantComponent'; 
import EditActions from '../../components/EditActionsComponent.js';
import MessageModal from '../../components/MessageModal.js';
import URLS from '../../urlConfig.js';

const CommunauteForumPage = ({searchTerm, refreshTrigger}) => {
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();
  const [selectedPost, setSelectedPost] = useState(null);
  const [user, setUser] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [PostComponentForumVisible, setPostComponentForumVisible] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [inputHeight, setInputHeight] = useState(0); 
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [blurEffect, setBlurEffect] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const adjustInputHeight = (event) => {
    setInputHeight(event.nativeEvent.contentSize.height);
  };

  useEffect(() => {
    fetchPosts();
  }, [refreshTrigger]);

  const handleLongPressOnPost = (post) => {
    setSelectedPost(post);
    setEditModalVisible(true);
    setPostComponentForumVisible(true);
    setBlurEffect(true);
  };


  const renderSelectedPost = () => {
    if (!selectedPost || !blurEffect) return null;
    return (
      <View>
        <View style={styles.selectedPostContainer}>
          {PostComponentForumVisible && (
            <PostComponentForum
              post={selectedPost}
              onPostPress={() => {}}
              onLongPress={() => {}}
            />
          )}
          {editModalVisible && (
            <EditActions
              onClose={() => {
                setEditModalVisible(false);
                setPostComponentForumVisible(false);
                setBlurEffect(false)
              }}
              onEdit={() => {
                setEditModalVisible(false);
                setPostComponentForumVisible(false); 
                setMessageText(selectedPost.contenu);
                setMessageModalVisible(true);
              }}
              onDelete={() => {
                setEditModalVisible(false);
                setPostComponentForumVisible(false);
                setBlurEffect(false)
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
            setPostComponentForumVisible(false);
            setBlurEffect(false); 
            setSelectedPost(null);
          }}
          messageText={messageText}
          setMessageText={setMessageText}
          sendMessage={() => {
            modifyPost(selectedPost.idPublication, messageText);
            setMessageModalVisible(false);
            setPostComponentForumVisible(false);
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

  useFocusEffect(
    useCallback(() => {
      fetchPosts(); 
    }, [])
  );

  const fetchPosts = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('User Not Found', 'No user ID found in storage');
        return;
      }
      
      const userDataResponse = await axios.get(`${URLS.url}/user/${userId}`);
      const userData = userDataResponse.data;
      setUser(userData);

      const postsUserResponse = await axios.get(`${URLS.url}/publicationUser/equipe/${userData.Equipe.idEquipe}`);
      const postsCommercantResponse = await axios.get(`${URLS.url}/publicationCommercant/equipe/${userData.Equipe.idEquipe}`);

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
      await axios.put(`${URLS.url}/publicationUser/${idPublication}`, updatedPost);
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      Alert.alert('Error', 'An error occurred while updating the post');
    }
  };

  const deletePost = async (idPublication) => {
    try {
      await axios.delete(`${URLS.url}/publicationUser/${idPublication}`);
      fetchPosts();
    } catch (error) {
      console.error('Error delete post', error);
      return false; 
    }
  };

  const disableBlurAndEditModal = () => {
    setBlurEffect(false);
    setEditModalVisible(false);
    setPostComponentForumVisible(true);
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
  }, [reloadKey]);

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
    if (post) {
      console
        return post.hasOwnProperty('idCommercant'); 
    }
  };

  const filteredPosts = posts.filter(post => {
    if(post) {
    const contentMatch = post.contenu.toLowerCase().includes(searchTerm.toLowerCase());
  
    const pseudoMatch = !isPostCommercant(post) && post.User.pseudo.toLowerCase().includes(searchTerm.toLowerCase());
  
    return contentMatch || pseudoMatch;
  }
  });
  

  return (
    <View style={styles.container}>
         {renderBlurOverlay()}
        {renderSelectedPost()}
      <ScrollView style={styles.scrollView}>
        <View style={styles.view}>
          {filteredPosts.map((post, index) => isPostCommercant(post) ? (
            <PostCommercantComponent key={`commercant-${index}`} post={post} />
          ) : (
            <PostComponentForum
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
    backgroundColor: "#D9D9D9",
  },
  scrollView: {
    flex: 1,
    width: "100%",
    paddingBottom: "20%"
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
