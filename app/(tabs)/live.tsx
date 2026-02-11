import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Tv, Clock, Video } from 'lucide-react-native';
import { WebView } from 'react-native-webview';
import { supabase } from '@/lib/supabase';
import { LiveShow } from '@/types/database';

const ORANGE = '#FF8C42';
const LIGHT_ORANGE = '#FFF5F0';
const WHITE = '#FFFFFF';
const GRAY = '#666666';
const LIGHT_GRAY = '#F5F5F5';

export default function LiveScreen() {
  const [liveShows, setLiveShows] = useState<LiveShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentShow, setCurrentShow] = useState<LiveShow | null>(null);
  const [nextShow, setNextShow] = useState<LiveShow | null>(null);
  const [facebookLiveUrl, setFacebookLiveUrl] = useState<string>('');

  useEffect(() => {
    fetchLiveShows();
    fetchFacebookLiveUrl();

    const interval = setInterval(() => {
      fetchLiveShows();
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchFacebookLiveUrl = async () => {
    try {
      const { data, error } = await supabase
        .from('radio_info')
        .select('value')
        .eq('key', 'facebook_live_url')
        .maybeSingle();

      if (!error && data) {
        setFacebookLiveUrl(data.value);
      }
    } catch (error) {
      console.error('Error fetching Facebook Live URL:', error);
    }
  };

  const isShowCurrentlyLive = (show: LiveShow): boolean => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;

    return currentTime >= show.start_time && currentTime < show.end_time;
  };

  const fetchLiveShows = async () => {
    try {
      const today = new Date().getDay();
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;

      const { data, error } = await supabase
        .from('live_shows')
        .select('*')
        .eq('day_of_week', today)
        .order('start_time', { ascending: true });

      if (!error && data) {
        setLiveShows(data);

        const liveShow = data.find(show => isShowCurrentlyLive(show));
        if (liveShow) {
          setCurrentShow(liveShow);
        } else {
          setCurrentShow(null);
        }

        const upcomingShow = data.find(show => show.start_time > currentTime);
        if (upcomingShow) {
          setNextShow(upcomingShow);
        } else {
          setNextShow(null);
        }
      }
    } catch (error) {
      console.error('Error fetching live shows:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Tv size={32} color={ORANGE} />
        <Text style={styles.headerTitle}>Émission en Direct</Text>
        <Text style={styles.headerSubtitle}>Depuis le studio</Text>
      </View>

      <View style={styles.videoPlayerContainer}>
        {facebookLiveUrl ? (
          <>
            <WebView
              source={{ uri: facebookLiveUrl }}
              style={styles.webView}
              allowsFullscreenVideo
              mediaPlaybackRequiresUserAction={false}
              javaScriptEnabled
              domStorageEnabled
            />
            <View style={styles.videoLiveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>VIDÉO EN DIRECT</Text>
            </View>
          </>
        ) : (
          <View style={styles.noVideoContainer}>
            <Video size={48} color={GRAY} />
            <Text style={styles.noVideoText}>
              Aucune diffusion vidéo en direct disponible
            </Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        {currentShow ? (
          <View style={styles.currentShowCard}>
            <View style={styles.liveTag}>
              <View style={styles.liveTagDot} />
              <Text style={styles.liveTagText}>EN DIRECT MAINTENANT</Text>
            </View>
            <Text style={styles.currentShowTitle}>{currentShow.title}</Text>
            <Text style={styles.currentShowHost}>Avec {currentShow.host_name}</Text>
            <Text style={styles.currentShowTime}>
              {currentShow.start_time.substring(0, 5)} - {currentShow.end_time.substring(0, 5)}
            </Text>
            <Text style={styles.currentShowDescription}>{currentShow.description}</Text>
          </View>
        ) : liveShows.length > 0 && (
          <View style={styles.noShowCard}>
            <Text style={styles.noShowTitle}>Aucune émission en direct pour le moment</Text>
            {nextShow ? (
              <>
                <Text style={styles.noShowSubtitle}>Prochaine émission :</Text>
                <View style={styles.nextShowInfo}>
                  <Text style={styles.nextShowTitle}>{nextShow.title}</Text>
                  <Text style={styles.nextShowTime}>
                    Débute à {nextShow.start_time.substring(0, 5)}
                  </Text>
                  <Text style={styles.nextShowHost}>Avec {nextShow.host_name}</Text>
                </View>
              </>
            ) : (
              <Text style={styles.noShowSubtitle}>Consultez le programme ci-dessous pour voir les prochaines émissions</Text>
            )}
          </View>
        )}

        <View style={styles.scheduleSection}>
          <Text style={styles.sectionTitle}>Émissions en direct aujourd'hui</Text>
          <Text style={styles.sectionSubtitle}>Programme de la journée</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={ORANGE} />
            </View>
          ) : liveShows.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucune émission en direct aujourd'hui</Text>
            </View>
          ) : (
            <View style={styles.showsList}>
              {liveShows.map((show) => {
                const isLive = isShowCurrentlyLive(show);
                return (
                  <View
                    key={show.id}
                    style={[
                      styles.showCard,
                      isLive && styles.showCardActive
                    ]}
                  >
                    <Image
                      source={{ uri: show.thumbnail_url }}
                      style={styles.showThumbnail}
                    />
                    <View style={styles.showContent}>
                      <View style={styles.showHeader}>
                        <View style={styles.timeTag}>
                          <Clock size={14} color={isLive ? WHITE : ORANGE} />
                          <Text style={[
                            styles.timeTagText,
                            isLive && styles.timeTagTextActive
                          ]}>
                            {show.start_time.substring(0, 5)} - {show.end_time.substring(0, 5)}
                          </Text>
                        </View>
                        {isLive && (
                          <View style={styles.liveBadge}>
                            <View style={styles.liveBadgeDot} />
                            <Text style={styles.liveBadgeText}>LIVE</Text>
                          </View>
                        )}
                      </View>
                      <Text style={[
                        styles.showTitle,
                        isLive && styles.showTitleActive
                      ]}>
                        {show.title}
                      </Text>
                      <Text style={[
                        styles.showDescription,
                        isLive && styles.showDescriptionActive
                      ]}>
                        {show.description}
                      </Text>
                      <Text style={[
                        styles.showHost,
                        isLive && styles.showHostActive
                      ]}>
                        Avec {show.host_name}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>
            À propos du flux vidéo
          </Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Source</Text>
            <Text style={styles.infoValue}>Facebook Live</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Qualité</Text>
            <Text style={styles.infoValue}>Haute définition</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Format</Text>
            <Text style={styles.infoValue}>Streaming en direct</Text>
          </View>
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Conseils</Text>
          <Text style={styles.tipText}>
            • Utilisez une connexion Wi-Fi pour éviter la consommation de données
          </Text>
          <Text style={styles.tipText}>
            • La vidéo nécessite plus de bande passante
          </Text>
          <Text style={styles.tipText}>
            • Vous pouvez passer en mode plein écran pour une meilleure expérience
          </Text>
        </View>
      </View>
    </ScrollView>
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
    paddingBottom: 24,
    backgroundColor: LIGHT_ORANGE,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: ORANGE,
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: GRAY,
    marginTop: 4,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: WHITE,
    marginRight: 8,
  },
  liveText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: WHITE,
    letterSpacing: 1,
  },
  videoPlayerContainer: {
    backgroundColor: LIGHT_ORANGE,
    paddingVertical: 20,
    paddingHorizontal: 20,
    minHeight: 350,
  },
  webView: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    backgroundColor: '#000',
  },
  videoLiveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
  },
  noVideoContainer: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  noVideoText: {
    fontSize: 16,
    color: GRAY,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
  content: {
    padding: 20,
  },
  currentShowCard: {
    backgroundColor: ORANGE,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  liveTagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: WHITE,
    marginRight: 6,
  },
  liveTagText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: WHITE,
    letterSpacing: 1,
  },
  currentShowTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: WHITE,
    marginBottom: 8,
  },
  currentShowHost: {
    fontSize: 16,
    color: WHITE,
    marginBottom: 8,
  },
  currentShowTime: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    marginBottom: 12,
  },
  currentShowDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 20,
  },
  noShowCard: {
    backgroundColor: LIGHT_GRAY,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
  },
  noShowTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: GRAY,
    marginBottom: 8,
    textAlign: 'center',
  },
  noShowSubtitle: {
    fontSize: 14,
    color: GRAY,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  nextShowInfo: {
    backgroundColor: WHITE,
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  nextShowTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ORANGE,
    marginBottom: 6,
    textAlign: 'center',
  },
  nextShowTime: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  nextShowHost: {
    fontSize: 14,
    color: GRAY,
  },
  scheduleSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ORANGE,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: GRAY,
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: GRAY,
  },
  showsList: {
    gap: 16,
  },
  showCard: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  showCardActive: {
    backgroundColor: ORANGE,
    shadowColor: ORANGE,
    shadowOpacity: 0.3,
  },
  showThumbnail: {
    width: 100,
    height: 140,
    backgroundColor: LIGHT_GRAY,
  },
  showContent: {
    flex: 1,
    padding: 12,
  },
  showHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHT_ORANGE,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: ORANGE,
    marginLeft: 4,
  },
  timeTagTextActive: {
    color: WHITE,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: WHITE,
    marginRight: 4,
  },
  liveBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: WHITE,
    letterSpacing: 0.5,
  },
  showTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  showTitleActive: {
    color: WHITE,
  },
  showDescription: {
    fontSize: 13,
    color: GRAY,
    lineHeight: 18,
    marginBottom: 8,
  },
  showDescriptionActive: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  showHost: {
    fontSize: 12,
    color: ORANGE,
    fontWeight: '600',
  },
  showHostActive: {
    color: WHITE,
  },
  infoSection: {
    backgroundColor: LIGHT_GRAY,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  infoLabel: {
    fontSize: 14,
    color: GRAY,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: ORANGE,
  },
  tipsSection: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  tipText: {
    fontSize: 14,
    color: GRAY,
    lineHeight: 24,
    marginTop: 4,
  },
});
