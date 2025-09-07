import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Filter, Search } from 'lucide-react-native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ReportCard } from '../Components/ReportCard';

export default function MyReport() {
  const navigation = useNavigation();

  const reports = [
    {
      id: 1,
      image:
        'https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=',
      context: 'Pothole on the main road near the city center.',
      status: 'In Progress',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      image:
        'https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=',
      context: 'Garbage not collected for three days in the residential area.',
      status: 'Completed',
      timestamp: 'Yesterday',
    },
    {
      id: 3,
      image:
        'https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=',
      context: 'Power outage in our block since morning.',
      status: 'Pending',
      timestamp: '1 day ago',
    },
  ];

  const getStatusCount = (status:any) => {
    return reports.filter(report => 
      report.status.toLowerCase() === status.toLowerCase()
    ).length;
  };

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
              <Search size={20} color="#667eea" />
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
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.reportsSection}>
          {/* <Text style={styles.sectionTitle}>Recent Reports</Text> */}
          {reports.map(report => (
            <ReportCard
              key={report.id}
              image={report.image}
              context={report.context}
              status={report.status}
              timestamp={report.timestamp}
            />
          ))}
        </View>

        {/* Empty State */}
        {reports.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <ArrowLeft size={48} color="#cbd5e1" />
            </View>
            <Text style={styles.emptyTitle}>No Reports Yet</Text>
            <Text style={styles.emptySubtitle}>
              Your submitted reports will appear here
            </Text>
          </View>
        )}
      </ScrollView>
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
    textAlign: 'center',
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