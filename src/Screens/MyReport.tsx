import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={26} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Reports</Text>
      </View>

      {/* Report List */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {reports.map(report => (
          <ReportCard
            key={report.id}
            image={report.image}
            context={report.context}
            status={report.status}
            timestamp={report.timestamp}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    marginRight: 10,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContent: {
    padding: 10,
  },
});
