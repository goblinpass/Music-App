import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [token, setToken] = useState('');

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
    // Fetch search results from Spotify API
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/search?q=${query}&type=track,artist`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSearchResults(response.data.tracks.items);
      } catch (error) {
        console.error('Error fetching search results:', error.message);
      }
    };

    if (query && token) {
      fetchSearchResults();
    } else {
      // Clear results when the query is empty
      setSearchResults([]);
    }
  }, [query, token]);

  return (
    <View>
      <TextInput
        placeholder="Search for songs or artists"
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Search" onPress={() => {}} />
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Player', { artist: item, token })}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text>{item.name}</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Player', { artist: item, token })}
              >
                <Text>▶️ Play</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default SearchScreen;
