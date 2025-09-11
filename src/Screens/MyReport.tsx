import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Filter, ArrowUpDown } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ReportCard } from '../Components/ReportCard';
import axios from 'axios';
import { BACKEND_URL } from '@env';
import { ReportType } from '../types/propType';

const FILTER_OPTIONS = [
  { label: 'All', value: null },
  { label: 'Submitted', value: 'Submitted' },
  { label: 'Acknowledged', value: 'Acknowledged' },
  { label: 'Assigned', value: 'Assigned' },
  { label: 'Resolved', value: 'Resolved' },
];

export default function MyReport() {
  const navigation = useNavigation();
  const [reports, setReports] = useState<ReportType[]>([]);
  const [sort, setSort] = useState('asc');
  const [filter, setFilter] = useState(null);

  const fetchReport = async () => {
    const response = await axios.get(`${BACKEND_URL}/users/getReport`, {
      params: {
        user_id: '681c81eb-6639-49a8-9efe-54ebb6b1c20f',
        status: filter,
        sort: sort,
        // page,
        // limit,
      },
    });
    setReports(response.data);
  };

  useEffect(() => {
    fetchReport();
  }, [filter, sort]);
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color="#667eea" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Reports</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton}>
              <ArrowUpDown size={20} color="#667eea" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Filter size={20} color="#667eea" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Stats Overview */}
      {/* <View style={styles.statsContainer}>
        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>{reports.length}</Text>
          <Text style={styles.statsLabel}>Total Reports</Text>
        </View>
        <View style={styles.statsDivider} />
        <View style={styles.statsCard}>
          <Text style={[styles.statsNumber, {color: '#f59e0b'}]}>{getStatusCount('In Progress')}</Text>
          <Text style={styles.statsLabel}>In Progress</Text>
        </View>
        <View style={styles.statsDivider} />
        <View style={styles.statsCard}>
          <Text style={[styles.statsNumber, {color: '#10b981'}]}>{getStatusCount('Completed')}</Text>
          <Text style={styles.statsLabel}>Completed</Text>
        </View>
      </View> */}

      {/* Report List */}
      <FlatList
        data={reports}
        keyExtractor={item => item.report_id.toString()}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ReportCard
            image={item.photo_url}
            context={item.description}
            status={item.status}
            timestamp={item.reported_at}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.emptyIcon}
            >
              <ArrowLeft size={48} color="#cbd5e1" />
            </TouchableOpacity>
            <Text style={styles.emptyTitle}>No Reports Yet</Text>
            <Text style={styles.emptySubtitle}>
              Your submitted reports will appear here
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
    marginHorizontal: 16,
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  statsCard: {
    flex: 1,
    alignItems: 'center',
  },
  statsNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 10,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
  reportsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
  },
});
