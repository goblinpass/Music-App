import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    // This should be done in a secure environment
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

  const performSearch = async () => {
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,artist`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSearchResults(response.data.tracks.items);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for songs or artists"
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Search" onPress={performSearch} />
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('PlayerScreen', { artist: item, token })} 
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.play}>▶️ Play</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  name: {
    flex: 1,
  },

});

export default SearchScreen;
