// components/ReportCard.tsx
import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { ReportCardProp } from "../types/propType";

export const ReportCard = ({ image, context, status, timestamp }: ReportCardProp) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "#28a745"; // Green
      case "in progress":
        return "#ffc107"; // Yellow
      case "pending":
        return "#007bff"; // Blue
      case "rejected":
        return "#dc3545"; // Red
      default:
        return "#6c757d"; // Gray
    }
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9}>
      {/* Report Image */}
      {image ? (
        <Image
          source={typeof image === "string" ? { uri: image } : image}
          style={styles.reportImage}
        />
      ) : (
        <View style={styles.placeholderImage} />
      )}

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.contextText} numberOfLines={2}>
          {context}
        </Text>

        <View style={styles.infoRow}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
          <Text style={styles.timestampText}>{timestamp}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  reportImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  contextText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    minWidth: 80,
    alignItems: "center",
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  timestampText: {
    fontSize: 12,
    color: "#888",
  },
});
