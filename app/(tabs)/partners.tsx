import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { Users, ExternalLink } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { Partner } from '@/types/database';

const ORANGE = '#FF8C42';
const LIGHT_ORANGE = '#FFF5F0';
const WHITE = '#FFFFFF';
const GRAY = '#666666';
const LIGHT_GRAY = '#F5F5F5';

export default function PartnersScreen() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data) {
        setPartners(data);
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const openWebsite = (url: string) => {
    if (url) {
      Linking.openURL(url).catch((err) => console.error('Error opening URL:', err));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Users size={32} color={ORANGE} />
        <Text style={styles.headerTitle}>Nos Partenaires</Text>
        <Text style={styles.headerSubtitle}>Ils nous font confiance</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>Merci à nos partenaires</Text>
          <Text style={styles.introText}>
            Nos partenaires jouent un rôle essentiel dans notre mission de vous offrir le meilleur contenu radio possible. Nous sommes fiers de collaborer avec eux.
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={ORANGE} />
          </View>
        ) : partners.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun partenaire pour le moment</Text>
          </View>
        ) : (
          <View style={styles.partnersList}>
            {partners.map((partner) => (
              <View key={partner.id} style={styles.partnerCard}>
                {partner.logo_url ? (
                  <Image
                    source={{ uri: partner.logo_url }}
                    style={styles.partnerLogo}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.partnerLogoPlaceholder}>
                    <Users size={48} color={GRAY} />
                  </View>
                )}
                <View style={styles.partnerContent}>
                  <Text style={styles.partnerName}>{partner.name}</Text>
                  <Text style={styles.partnerDescription}>{partner.description}</Text>
                  {partner.website && (
                    <TouchableOpacity
                      style={styles.websiteButton}
                      onPress={() => openWebsite(partner.website)}
                      activeOpacity={0.7}
                    >
                      <ExternalLink size={16} color={ORANGE} />
                      <Text style={styles.websiteButtonText}>Visiter le site</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.becomePartnerCard}>
          <Text style={styles.becomePartnerTitle}>Devenez partenaire</Text>
          <Text style={styles.becomePartnerText}>
            Vous souhaitez devenir partenaire de Radio Cocody FM ? Contactez-nous pour découvrir nos offres de collaboration.
          </Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactText}>Info@radiococodyfm.ci</Text>
            <Text style={styles.contactText}>+225 0596251904</Text>
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
  content: {
    padding: 20,
  },
  introCard: {
    backgroundColor: LIGHT_GRAY,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ORANGE,
    marginBottom: 12,
  },
  introText: {
    fontSize: 14,
    color: GRAY,
    lineHeight: 22,
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
  partnersList: {
    marginBottom: 24,
  },
  partnerCard: {
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
  partnerLogo: {
    width: '100%',
    height: 180,
    backgroundColor: WHITE,
  },
  partnerLogoPlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: LIGHT_GRAY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  partnerContent: {
    padding: 16,
  },
  partnerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  partnerDescription: {
    fontSize: 14,
    color: GRAY,
    lineHeight: 20,
    marginBottom: 12,
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LIGHT_ORANGE,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  websiteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: ORANGE,
    marginLeft: 6,
  },
  becomePartnerCard: {
    backgroundColor: ORANGE,
    borderRadius: 12,
    padding: 20,
  },
  becomePartnerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: WHITE,
    marginBottom: 12,
  },
  becomePartnerText: {
    fontSize: 14,
    color: WHITE,
    lineHeight: 22,
    marginBottom: 16,
  },
  contactInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 12,
  },
  contactText: {
    fontSize: 14,
    fontWeight: '600',
    color: WHITE,
    lineHeight: 24,
  },
});
