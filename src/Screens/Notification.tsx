import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, CheckCheck } from 'lucide-react-native';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NotificationCard } from '../Components/NotificationCard';

export default function Notification() {
  const navigation = useNavigation();
  const notifications = [
    {
      id: 1,
      image:
        'https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=',
      notificationText: 'Jane Smith commented on your photo: "Looks amazing!"',
      timestamp: '2h',
      isRead: false,
    },
    {
      id: 2,
      image:
        'https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=',
      notificationText: 'Alex Johnson and 3 others liked your post.',
      timestamp: '5h',
      isRead: true,
    },
    {
      id: 3,
      image:
        'https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=',
      notificationText: 'Sarah Lee sent you a friend request.',
      timestamp: '1d',
      isRead: false,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <View style={styles.leftGroup}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={26} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>

        <TouchableOpacity style={styles.headerButton}>
          <CheckCheck size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

      {/* Notification List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {notifications.map(notification => (
          <NotificationCard
            key={notification.id}
            image={notification.image}
            notificationText={notification.notificationText}
            timestamp={notification.timestamp}
            isRead={notification.isRead}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9', // soft background
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 6,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginLeft: 8, // space between arrow & title
  },
  scrollContent: {
    padding: 12,
  },
});
