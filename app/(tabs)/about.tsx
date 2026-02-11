import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Info, Radio, Target, Heart, Phone, MapPin, Mail, Facebook, Globe } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

const ORANGE = '#FF8C42';
const LIGHT_ORANGE = '#FFF5F0';
const WHITE = '#FFFFFF';
const GRAY = '#666666';
const LIGHT_GRAY = '#F5F5F5';

export default function AboutScreen() {
  const [history, setHistory] = useState('');
  const [mission, setMission] = useState('');
  const [values, setValues] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactFacebook, setContactFacebook] = useState('');
  const [contactWebsite, setContactWebsite] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [historyResult, missionResult, valuesResult, phoneResult, addressResult, emailResult, facebookResult, websiteResult] = await Promise.all([
        supabase.from('radio_info').select('*').eq('key', 'history').maybeSingle(),
        supabase.from('radio_info').select('*').eq('key', 'mission').maybeSingle(),
        supabase.from('radio_info').select('*').eq('key', 'values').maybeSingle(),
        supabase.from('radio_info').select('*').eq('key', 'contact_phone').maybeSingle(),
        supabase.from('radio_info').select('*').eq('key', 'contact_address').maybeSingle(),
        supabase.from('radio_info').select('*').eq('key', 'contact_email').maybeSingle(),
        supabase.from('radio_info').select('*').eq('key', 'contact_facebook').maybeSingle(),
        supabase.from('radio_info').select('*').eq('key', 'contact_website').maybeSingle(),
      ]);

      if (!historyResult.error && historyResult.data) {
        setHistory(historyResult.data.value);
      }

      if (!missionResult.error && missionResult.data) {
        setMission(missionResult.data.value);
      }

      if (!valuesResult.error && valuesResult.data) {
        setValues(valuesResult.data.value);
      }

      if (!phoneResult.error && phoneResult.data) {
        setContactPhone(phoneResult.data.value);
      }

      if (!addressResult.error && addressResult.data) {
        setContactAddress(addressResult.data.value);
      }

      if (!emailResult.error && emailResult.data) {
        setContactEmail(emailResult.data.value);
      }

      if (!facebookResult.error && facebookResult.data) {
        setContactFacebook(facebookResult.data.value);
      }

      if (!websiteResult.error && websiteResult.data) {
        setContactWebsite(websiteResult.data.value);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Info size={32} color={ORANGE} />
          <Text style={styles.headerTitle}>À Propos</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={ORANGE} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Info size={32} color={ORANGE} />
        <Text style={styles.headerTitle}>À Propos</Text>
        <Text style={styles.headerSubtitle}>Notre histoire et nos valeurs</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Radio size={24} color={ORANGE} />
            <Text style={styles.sectionTitle}>Notre Histoire</Text>
          </View>
          <View style={styles.historyCard}>
            <Text style={styles.historyText}>{history}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Target size={24} color={ORANGE} />
            <Text style={styles.sectionTitle}>Missions et Valeurs</Text>
          </View>

          <View style={styles.missionCard}>
            <View style={styles.missionHeader}>
              <Target size={20} color={ORANGE} />
              <Text style={styles.missionTitle}>Notre Mission</Text>
            </View>
            <Text style={styles.missionText}>{mission}</Text>
          </View>

          <View style={styles.valuesCard}>
            <View style={styles.missionHeader}>
              <Heart size={20} color={ORANGE} />
              <Text style={styles.missionTitle}>Nos Valeurs</Text>
            </View>
            <Text style={styles.valuesText}>{values}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>Contactez-nous</Text>
            {contactPhone && (
              <View style={styles.contactRow}>
                <Phone size={18} color={ORANGE} />
                <Text style={styles.contactText}>{contactPhone}</Text>
              </View>
            )}
            {contactEmail && (
              <View style={styles.contactRow}>
                <Mail size={18} color={ORANGE} />
                <Text style={styles.contactText}>{contactEmail}</Text>
              </View>
            )}
            {contactWebsite && (
              <View style={styles.contactRow}>
                <Globe size={18} color={ORANGE} />
                <Text style={styles.contactText}>{contactWebsite}</Text>
              </View>
            )}
            {contactAddress && (
              <View style={styles.contactRow}>
                <MapPin size={18} color={ORANGE} />
                <Text style={styles.contactText}>{contactAddress}</Text>
              </View>
            )}
            {contactFacebook && (
              <View style={styles.contactRow}>
                <Facebook size={18} color={ORANGE} />
                <Text style={styles.contactText}>{contactFacebook}</Text>
              </View>
            )}
          </View>
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: ORANGE,
    marginLeft: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: GRAY,
    marginBottom: 16,
    marginTop: -8,
  },
  historyCard: {
    backgroundColor: LIGHT_GRAY,
    borderRadius: 12,
    padding: 16,
  },
  historyText: {
    fontSize: 15,
    color: GRAY,
    lineHeight: 24,
  },
  missionCard: {
    backgroundColor: LIGHT_ORANGE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  valuesCard: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: LIGHT_ORANGE,
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ORANGE,
    marginLeft: 8,
  },
  missionText: {
    fontSize: 15,
    color: GRAY,
    lineHeight: 24,
  },
  valuesText: {
    fontSize: 15,
    color: GRAY,
    lineHeight: 24,
    fontWeight: '500',
  },
  contactCard: {
    backgroundColor: LIGHT_ORANGE,
    borderRadius: 12,
    padding: 20,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ORANGE,
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  contactText: {
    fontSize: 14,
    color: GRAY,
    lineHeight: 24,
    marginLeft: 10,
    flex: 1,
  },
});
