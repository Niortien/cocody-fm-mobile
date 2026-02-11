import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Play, Pause, Volume2 } from 'lucide-react-native';
import { Audio } from 'expo-av';
import { supabase } from '@/lib/supabase';
import { RadioInfo } from '@/types/database';

const ORANGE = '#FF8C42';
const LIGHT_ORANGE = '#FFF5F0';
const WHITE = '#FFFFFF';
const GRAY = '#666666';
const LIGHT_GRAY = '#F5F5F5';

export default function RadioScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [radioName, setRadioName] = useState('Radio Cocody FM');
  const [tagline, setTagline] = useState('Votre radio locale');
  const [streamUrl, setStreamUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    fetchRadioInfo();
    setupAudio();

    return () => {
      cleanupAudio();
    };
  }, []);

  const fetchRadioInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('radio_info')
        .select('*')
        .in('key', ['radio_name', 'tagline', 'radio_stream_url']);

      if (!error && data) {
        data.forEach((item: RadioInfo) => {
          if (item.key === 'radio_name') setRadioName(item.value);
          if (item.key === 'tagline') setTagline(item.value);
          if (item.key === 'radio_stream_url') setStreamUrl(item.value);
        });
      }
    } catch (error) {
      console.error('Error fetching radio info:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
    } catch (error) {
      console.error('Error setting up audio:', error);
    }
  };

  const cleanupAudio = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    } catch (error) {
      console.error('Error cleaning up audio:', error);
    }
  };

  const togglePlay = async () => {
    try {
      if (isPlaying) {
        await pauseAudio();
      } else {
        await playAudio();
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  const playAudio = async () => {
    try {
      setIsLoadingAudio(true);

      if (soundRef.current) {
        await soundRef.current.playAsync();
      } else {
        const { sound } = await Audio.Sound.createAsync(
          { uri: streamUrl },
          { shouldPlay: true },
          onPlaybackStatusUpdate
        );
        soundRef.current = sound;
      }

      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const pauseAudio = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.pauseAsync();
      }
      setIsPlaying(false);
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
      setIsLoadingAudio(status.isBuffering);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={ORANGE} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Volume2 size={48} color={ORANGE} />
        </View>
        <Text style={styles.radioName}>{radioName}</Text>
        <Text style={styles.tagline}>{tagline}</Text>
      </View>

      <View style={styles.playerContainer}>
        <View style={styles.nowPlaying}>
          <Text style={styles.nowPlayingLabel}>EN DIRECT</Text>
          <Text style={styles.showTitle}>Émission en cours</Text>
        </View>

        <TouchableOpacity
          style={styles.playButton}
          onPress={togglePlay}
          activeOpacity={0.8}
          disabled={isLoadingAudio || !streamUrl}
        >
          {isLoadingAudio ? (
            <ActivityIndicator size="large" color={WHITE} />
          ) : isPlaying ? (
            <Pause size={48} color={WHITE} fill={WHITE} />
          ) : (
            <Play size={48} color={WHITE} fill={WHITE} />
          )}
        </TouchableOpacity>

        <Text style={styles.playButtonText}>
          {isLoadingAudio ? 'Chargement...' : isPlaying ? 'Arrêter' : 'Écouter en direct'}
        </Text>
      </View>

      <View style={styles.info}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Qualité Audio</Text>
          <Text style={styles.infoValue}>HD 320 kbps</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Auditeurs</Text>
          <Text style={styles.infoValue}>1,234</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: LIGHT_ORANGE,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  radioName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: ORANGE,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    color: GRAY,
  },
  playerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  nowPlaying: {
    alignItems: 'center',
    marginBottom: 32,
  },
  nowPlayingLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: ORANGE,
    letterSpacing: 2,
    marginBottom: 8,
  },
  showTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: GRAY,
  },
  playButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: ORANGE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 16,
  },
  playButtonText: {
    fontSize: 16,
    color: GRAY,
    fontWeight: '600',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 32,
    paddingVertical: 24,
    backgroundColor: LIGHT_GRAY,
  },
  infoCard: {
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 12,
    color: GRAY,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ORANGE,
  },
});
