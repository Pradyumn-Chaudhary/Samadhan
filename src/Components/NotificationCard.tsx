import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Dot } from 'lucide-react-native';
import { NotificationCardProp } from '../types/propType';

export const NotificationCard = ({
  message,
  isRead,
  created_at,
}: NotificationCardProp) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      // style={[styles.card, !isRead && styles.unreadCard]}
    >
      {/* Notification Content */}
      <View style={styles.contentContainer}>
        <Text
          style={styles.notificationText}
          // style={[styles.notificationText, !isRead && styles.unreadText]}
          numberOfLines={2}
        >
          {message}
        </Text>
        <Text style={styles.timestamp}>{created_at}</Text>
      </View>

      {/* Unread Indicator */}
      {/* {!isRead && (
        <Dot size={24} color="#007AFF" />
      )} */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  unreadCard: {
    backgroundColor: '#f7f9fc',
  },
  imageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e8e8e8',
  },
  defaultImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e8e8e8',
  },
  contentContainer: {
    flex: 1,
  },
  notificationText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 22,
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: '600',
    color: '#000000',
  },
  timestamp: {
    fontSize: 14,
    color: '#666666',
  },
});