import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
  const [token, setToken] = useState('');
  const [newReleases, setNewReleases] = useState([]);

  useEffect(() => {
    // Ideally, move this to a secure backend environment
    const CLIENT_ID = 'cdef2c9f3adc4ec18fec1eb184f41ae9';
    const CLIENT_SECRET = '3c07f57baccb498296010da9866aa0dc';

    const fetchToken = async () => {
      try {
        const response = await axios.post(
          'https://accounts.spotify.com/api/token',
          `grant_type=client_credentials`,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              // Use basic auth to secure your client credentials
              'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
            },
          }
        );
        setToken(response.data.access_token);
      } catch (error) {
        console.error('Error obtaining access token:', error);
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    const getNewReleases = async () => {
      try {
        const response = await axios.get(
          'https://api.spotify.com/v1/browse/new-releases?country=US&limit=10',
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        setNewReleases(response.data.albums.items);
      } catch (error) {
        console.error('Error fetching new releases:', error);
      }
    };

    if (token) {
      getNewReleases();
    }
  }, [token]);

  const handlePlayButtonPress = (artist) => {
    navigation.navigate('PlayerScreen', { artist, token }); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top 10 New Releases in the US</Text>
      <FlatList
        data={newReleases}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handlePlayButtonPress(item)}>
            <Image
              source={{ uri: item.images[0]?.url }}
              style={styles.image}
            />
            <Text style={styles.text}>{item.name}</Text>
            <Text style={styles.playIcon}>▶️</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  text: {
    flex: 1,
    marginLeft: 10,
  },
});

export default HomeScreen;
