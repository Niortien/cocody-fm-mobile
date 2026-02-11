import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { Program } from '@/types/database';

const ORANGE = '#FF8C42';
const LIGHT_ORANGE = '#FFF5F0';
const WHITE = '#FFFFFF';
const GRAY = '#666666';
const LIGHT_GRAY = '#F5F5F5';

const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export default function ScheduleScreen() {
  const [selectedDay, setSelectedDay] = useState(1);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, [selectedDay]);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('day_of_week', selectedDay)
        .order('start_time', { ascending: true });

      if (!error && data) {
        setPrograms(data);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Calendar size={32} color={ORANGE} />
        <Text style={styles.headerTitle}>Grille des Programmes</Text>
        <Text style={styles.headerSubtitle}>Toute la semaine</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysContainer}>
        {DAYS.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayButton,
              selectedDay === index && styles.dayButtonActive,
            ]}
            onPress={() => setSelectedDay(index)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.dayText,
                selectedDay === index && styles.dayTextActive,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.programsList}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={ORANGE} />
          </View>
        ) : programs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun programme pour ce jour</Text>
          </View>
        ) : (
          programs.map((program) => (
            <View key={program.id} style={styles.programCard}>
              <Image
                source={{ uri: program.image_url }}
                style={styles.programImage}
              />
              <View style={styles.programContent}>
                <View style={styles.timeContainer}>
                  <Clock size={16} color={ORANGE} />
                  <Text style={styles.timeText}>
                    {program.start_time.substring(0, 5)} - {program.end_time.substring(0, 5)}
                  </Text>
                </View>
                <Text style={styles.programTitle}>{program.title}</Text>
                <Text style={styles.programDescription}>{program.description}</Text>
                <Text style={styles.programHost}>Avec {program.host_name}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
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
  daysContainer: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  dayButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: LIGHT_GRAY,
  },
  dayButtonActive: {
    backgroundColor: ORANGE,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: GRAY,
  },
  dayTextActive: {
    color: WHITE,
  },
  programsList: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: GRAY,
  },
  programCard: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  programImage: {
    width: 100,
    height: 120,
  },
  programContent: {
    flex: 1,
    padding: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: ORANGE,
    marginLeft: 4,
  },
  programTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  programDescription: {
    fontSize: 13,
    color: GRAY,
    lineHeight: 18,
    marginBottom: 8,
  },
  programHost: {
    fontSize: 12,
    color: ORANGE,
    fontWeight: '600',
  },
});
