import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
  const [token, setToken] = useState('');
  const [newReleases, setNewReleases] = useState([]);

  useEffect(() => {
    // Use your Client ID and Client Secret obtained from your Spotify App
    const CLIENT_ID = 'cdef2c9f3adc4ec18fec1eb184f41ae9';
    const CLIENT_SECRET = '3c07f57baccb498296010da9866aa0dc';

    // Fetch the access token using the Client Credentials Flow
    const fetchToken = async () => {
      try {
        const response = await axios.post(
          'https://accounts.spotify.com/api/token',
          `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
        setToken(response.data.access_token);
      } catch (error) {
        console.error('Error obtaining access token:', error.message);
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    // Fetch new releases using the obtained token
    const getNewReleases = async () => {
      try {
        const response = await axios.get(
          'https://api.spotify.com/v1/browse/new-releases?country=US&limit=10',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data.albums?.items) {
          throw new Error('Invalid response format');
        }

        setNewReleases(response.data.albums.items);
      } catch (error) {
        console.error('Error fetching new releases:', error.message);
      }
    };

    if (token) {
      getNewReleases();
    }
  }, [token]);

  const handlePlayButtonPress = (artist) => {
    navigation.navigate('Player', { artist, token });
  };

  return (
    <View>
      <Text>Top 10 New Releases in the US</Text>
      <FlatList
        data={newReleases}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => navigation.navigate('Player', { artist: item, token })}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={{ uri: item.images[0]?.url }}
                  style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
                />
                <Text>{item.name}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePlayButtonPress(item)}>
              <Text>▶️</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default HomeScreen;
