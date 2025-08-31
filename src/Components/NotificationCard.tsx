import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Dot } from 'lucide-react-native';
import { NotificationCardProp } from '../types/propType';

export const NotificationCard = ({
  image,
  notificationText,
  timestamp,
  isRead,
}: NotificationCardProp) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.card, !isRead && styles.unreadCard]}
    >
      {/* Profile Picture / Icon */}
      <View style={styles.imageContainer}>
        {image ? (
          <Image
            source={
              typeof image === 'string' ? { uri: image } : image
            }
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.defaultImagePlaceholder} />
        )}
      </View>

      {/* Notification Content */}
      <View style={styles.contentContainer}>
        <Text
          style={[styles.notificationText, !isRead && styles.unreadText]}
          numberOfLines={2}
        >
          {notificationText}
        </Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>

      {/* Unread Indicator */}
      {!isRead && (
        <View style={styles.unreadDotContainer}>
          <Dot size={18} color="#007bff" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 6,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  unreadCard: {
    backgroundColor: '#f0f7ff', // soft blue highlight for unread
  },
  imageContainer: {
    marginRight: 12,
  },
  profileImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  defaultImagePlaceholder: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#e0e0e0',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  notificationText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 20,
  },
  unreadText: {
    fontWeight: '600',
    color: '#222',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  unreadDotContainer: {
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
