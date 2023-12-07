import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const PlayerScreen = ({ route }) => {
  const { artist, token } = route.params || {};

  if (!artist || !token) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: Artist information not available.</Text>
      </View>
    );
  }

  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = async () => {
    try {
      const response = await axios.put(
        'https://api.spotify.com/v1/me/player/play',
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error toggling play/pause:', error.message);
    }
  };

  const skipNext = async () => {
    try {
      const response = await axios.post(
        'https://api.spotify.com/v1/me/player/next',
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Skipped to the next track:', response.data);
    } catch (error) {
      console.error('Error skipping to the next track:', error.message);
    }
  };

  const skipPrevious = async () => {
    try {
      const response = await axios.post(
        'https://api.spotify.com/v1/me/player/previous',
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Skipped to the previous track:', response.data);
    } catch (error) {
      console.error('Error skipping to the previous track:', error.message);
    }
  };

  const adjustVolume = async (volume) => {
    try {
      const response = await axios.put(
        `https://api.spotify.com/v1/me/player/volume?volume_percent=${volume * 100}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Adjusted volume:', response.data);
    } catch (error) {
      console.error('Error adjusting volume:', error.message);
    }
  };

  const seekForward = async () => {
    try {
      const response = await axios.put(
        'https://api.spotify.com/v1/me/player/seek?position_ms=10000',
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Seeking forward:', response.data);
    } catch (error) {
      console.error('Error seeking forward:', error.message);
    }
  };

  const seekBackward = async () => {
    try {
      const response = await axios.put(
        'https://api.spotify.com/v1/me/player/seek?position_ms=-10000',
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Seeking backward:', response.data);
    } catch (error) {
      console.error('Error seeking backward:', error.message);
    }
  };

  useEffect(() => {
    const fetchPlaybackState = async () => {
      try {
        const response = await axios.get('https://api.spotify.com/v1/me/player', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIsPlaying(response.data.is_playing);
      } catch (error) {
        console.error('Error fetching playback state:', error.message);
      }
    };

    fetchPlaybackState();
  }, [token]);

  return (
    <View style={styles.container}>
      <Text style={styles.nowPlayingText}>Now Playing</Text>
      <Image source={{ uri: artist.images[0]?.url }} style={styles.artistImage} />
      <Text style={styles.artistName}>{artist.name}</Text>

      <View style={styles.controlsContainer}>
        <TouchableOpacity onPress={skipPrevious}>
          <Icon name="step-backward" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={seekBackward}>
          <Icon name="backward" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlayPause}>
          <Icon
            name={isPlaying ? 'pause-circle' : 'play-circle'}
            size={48}
            color="black"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={seekForward}>
          <Icon name="forward" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={skipNext}>
          <Icon name="step-forward" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.volumeControls}>
        <TouchableOpacity onPress={() => adjustVolume(0.5)}>
          <Icon name="volume-down" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => adjustVolume(1)}>
          <Icon name="volume-up" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nowPlayingText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  artistImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  artistName: {
    fontSize: 16,
    marginBottom: 20,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  volumeControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
});

export default PlayerScreen;
