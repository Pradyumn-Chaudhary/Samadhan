// components/ReportCard.tsx
import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { ReportCardProp } from "../types/propType";

export const ReportCard = ({ image, context, status, timestamp }: ReportCardProp) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "#10b981"; // Emerald
      case "in progress":
        return "#f59e0b"; // Amber
      case "pending":
        return "#3b82f6"; // Blue
      case "rejected":
        return "#ef4444"; // Red
      default:
        return "#6b7280"; // Gray
    }
  };

  const getStatusBackgroundColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "#ecfdf5"; // Light green
      case "in progress":
        return "#fffbeb"; // Light amber
      case "pending":
        return "#eff6ff"; // Light blue
      case "rejected":
        return "#fef2f2"; // Light red
      default:
        return "#f9fafb"; // Light gray
    }
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      {/* Report Image */}
      <View style={styles.imageContainer}>
        {image ? (
          <Image
            source={typeof image === "string" ? { uri: image } : image}
            style={styles.reportImage}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <View style={styles.placeholderIcon} />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <View style={styles.textSection}>
          <Text style={styles.contextText} numberOfLines={2}>
            {context}
          </Text>
          <Text style={styles.timestampText}>{timestamp}</Text>
        </View>

        <View style={styles.statusContainer}>
          <View 
            style={[
              styles.statusBadge, 
              { 
                backgroundColor: getStatusBackgroundColor(status),
                borderColor: getStatusColor(status) + '30'
              }
            ]}
          >
            <View 
              style={[
                styles.statusDot, 
                { backgroundColor: getStatusColor(status) }
              ]} 
            />
            <Text 
              style={[
                styles.statusText, 
                { color: getStatusColor(status) }
              ]}
            >
              {status}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  imageContainer: {
    position: "relative",
  },
  reportImage: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
  placeholderImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#cbd5e1",
  },
  contentContainer: {
    padding: 16,
  },
  textSection: {
    marginBottom: 12,
  },
  contextText: {
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "600",
    lineHeight: 22,
    marginBottom: 6,
  },
  timestampText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
  statusContainer: {
    alignItems: "flex-start",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
});