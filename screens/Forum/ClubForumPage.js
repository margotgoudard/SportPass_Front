import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PostClubComponent from '../../components/PostClubComponent'; 
import PostPartenaireComponent from '../../components/PostPartenaireComponent'; 
import URLS from '../../urlConfig.js';
import AppLoader from '../../components/AppLoader.js';

const ClubForumPage = ({ searchTerm, refreshTrigger }) => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [refreshTrigger]);

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

      const postsClubResponse = await axios.get(`${URLS.url}/publicationClub/equipe/${userData.Equipe.idEquipe}`);
      const postsPartenaireResponse = await axios.get(`${URLS.url}/publicationPartenaire`);

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
    setLoading(false);
  }, [reloadKey]);

  const interleavePosts = (postsClub, postsPartenaire) => {
    let combinedPosts = [];
    let partenaireIndex = 0;
  
    for (let i = 0; i < postsClub.length; i++) {
      combinedPosts.push(postsClub[i]);
      if ((i + 1) % 3 === 0 && partenaireIndex < postsPartenaire.length) {
        combinedPosts.push(postsPartenaire[partenaireIndex]);
        partenaireIndex++;
      }
    }
  
    while (partenaireIndex < postsPartenaire.length) {
      combinedPosts.push(postsPartenaire[partenaireIndex]);
      partenaireIndex++;
    }
  
    return combinedPosts;
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

  if (loading) {
    return <AppLoader />;
  }  

  return (
    <View style={styles.container}>
      <View style={styles.scrollView}>
        <View style={styles.view}>
          {filteredPosts.map((post, index) => isPostPartenaire(post) ? (
            <PostPartenaireComponent key={`partenaire-${index}`} post={post} style={styles.post} />
          ) : (
            <PostClubComponent
              key={`club-${index}`}
              post={post}
              style={styles.post}
              updateTrigger={refreshTrigger}
            />
          ))}
        </View>
      </View>
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
    paddingBottom: "20%",
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
