import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Filter, ArrowUpDown } from 'lucide-react-native';
import React, { useEffect, useState, useRef } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ReportCard } from '../Components/ReportCard';
import axios from 'axios';
import { BACKEND_URL } from '@env';
import { ReportType } from '../types/propType';
import { useUser } from '../context/UserContext';

const FILTER_OPTIONS = [
  { label: 'All', value: null },
  { label: 'Submitted', value: 'Submitted' },
  { label: 'Acknowledged', value: 'Acknowledged' },
  { label: 'Assigned', value: 'Assigned' },
  { label: 'Resolved', value: 'Resolved' },
];

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'desc' },
  { label: 'Oldest First', value: 'asc' },
];

export default function MyReport() {
  const navigation = useNavigation();
  const [reports, setReports] = useState<ReportType[]>([]);
  const [sort, setSort] = useState('desc'); // Default to newest first
  const [filter, setFilter] = useState<string | null>(null);
  const { user } = useUser();

  // State and animation for Filter panel
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const filterSlideAnim = useRef(new Animated.Value(-300)).current;

  // State and animation for Sort panel
  const [isSortVisible, setIsSortVisible] = useState(false);
  const sortSlideAnim = useRef(new Animated.Value(-300)).current;

  const toggleFilter = () => {
    if (isSortVisible) setIsSortVisible(false); // Close sort if open

    if (isFilterVisible) {
      Animated.timing(filterSlideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsFilterVisible(false));
    } else {
      setIsFilterVisible(true);
      Animated.timing(filterSlideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const toggleSort = () => {
    if (isFilterVisible) setIsFilterVisible(false); // Close filter if open

    if (isSortVisible) {
      Animated.timing(sortSlideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsSortVisible(false));
    } else {
      setIsSortVisible(true);
      Animated.timing(sortSlideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleFilterSelect = (value: string | null) => {
    setFilter(value);
    toggleFilter();
  };

  const handleSortSelect = (value: string) => {
    setSort(value);
    toggleSort();
  };

  const fetchReport = async () => {
    const response = await axios.get(`${BACKEND_URL}/users/getReport`, {
      params: {
        user_id: user.user_id,
        status: filter,
        sort: sort,
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
            <TouchableOpacity style={styles.actionButton} onPress={toggleSort}>
              <ArrowUpDown size={20} color="#667eea" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={toggleFilter}
            >
              <Filter size={20} color="#667eea" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Sort Panel */}
      {isSortVisible && (
        <Animated.View
          style={[
            styles.filterPanel,
            { transform: [{ translateY: sortSlideAnim }] },
          ]}
        >
          <Text style={styles.filterTitle}>Sort by Date</Text>
          {SORT_OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={() => handleSortSelect(option.value)}
            >
              <Text
                style={[
                  styles.optionText,
                  sort === option.value && styles.activeOptionText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}

      {/* Filter Panel */}
      {isFilterVisible && (
        <Animated.View
          style={[
            styles.filterPanel,
            { transform: [{ translateY: filterSlideAnim }] },
          ]}
        >
          <Text style={styles.filterTitle}>Filter by Status</Text>
          {FILTER_OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={() => handleFilterSelect(option.value)}
            >
              <Text
                style={[
                  styles.optionText,
                  filter === option.value && styles.activeOptionText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}

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
    zIndex: 10, // Ensure header is above the list but below the filter panel
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
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
    textAlign: 'center',
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
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 20,
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
  // --- Updated & New Styles for Filter Panel ---
  filterPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 80, // Add padding to not overlap header content
    paddingBottom: 20,
    zIndex: 100, // High zIndex to ensure it's on top of everything
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 10,
  },
  option: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  optionText: {
    fontSize: 16,
    color: '#475569',
  },
  activeOptionText: {
    color: '#667eea',
    fontWeight: '700',
  },
});
