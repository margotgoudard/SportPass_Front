import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PostClubComponent from '../../components/PostClubComponent'; 
import PostPartenaireComponent from '../../components/PostPartenaireComponent'; 

const ClubForumPage = ({searchTerm}) => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

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
      
      const userDataResponse = await axios.get(`http://10.0.2.2:4000/api/user/${userId}`);
      const userData = userDataResponse.data;
      setUser(userData);

      const postsClubResponse = await axios.get(`http://10.0.2.2:4000/api/publicationClub/equipe/${userData.Equipe.idEquipe}`);
      const postsPartenaireResponse = await axios.get(`http://10.0.2.2:4000/api/publicationPartenaire`);

      const postsClub = postsClubResponse.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      const postsPartenaire = postsPartenaireResponse.data;

      const combinedPosts = interleavePosts(postsClub, postsPartenaire);
      setPosts(combinedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('Error', 'An error occurred while fetching posts');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [reloadKey]);

  const interleavePosts = (postsClub, postsPartenaire) => {
    const result = [];
    let partenaireIndex = 0;
    postsClub.forEach((post, index) => {
      result.push(post);
      if ((index + 1) % 3 === 0 ) {
        result.push(postsPartenaire[partenaireIndex++]);
      }
      else if ((index + 1) % 2 === 0 ) {
        result.push(postsPartenaire[partenaireIndex++]);
      }
        else  if ((index + 1) % 1 === 0 ) {
            result.push(postsPartenaire[partenaireIndex++]);
          }
    });
    return result;
  };

  const isPostPartenaire = (post) => {
    if (post) {
        return post.hasOwnProperty('idPartenaire'); 
    }
  };

  const filteredPosts = posts.filter(post => {
    if (post) {
        const contentMatch = post.contenu ? post.contenu.toLowerCase().includes(searchTerm.toLowerCase()) : false;
        const titre = isPostPartenaire(post) ? post.Partenaire && post.Partenaire.titre ? post.Partenaire.titre.toLowerCase().includes(searchTerm.toLowerCase()) : false : false;
        return contentMatch || titre;
    }
    return false;
});

  

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.view}>
          {filteredPosts.map((post, index) => isPostPartenaire(post) ? (
            <PostPartenaireComponent key={`partenaire-${index}`} post={post} />
          ) : (
            <PostClubComponent
              key={`club-${index}`}
              post={post}
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

export default ClubForumPage;
