import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Mic,
} from 'lucide-react-native';
import React, { useState } from 'react';
import AudioRecorder from '../Components/AudioRecorder';
import { useUser } from '../context/UserContext';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {
  CameraOptions,
  launchCamera,
  MediaType,
  Asset,
} from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { uploadMedia } from '../Services/uploadMedia';
import { BACKEND_URL, ML_CLASSIFIER_URL } from '@env';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';

// ─── ML Classifier ────────────────────────────────────────────────────────────

/** Maps ML predicted_class → our backend category value */
const CLASS_TO_CATEGORY: Record<string, string> = {
  road_pothole: 'Road',
  electricity_wire_issue: 'Electricity',
  garbage_dump: 'Garbage',
};

type ClassificationStatus =
  | 'idle' // no photo yet
  | 'classifying' // waiting for ML response
  | 'classified' // high-confidence match → category auto-set
  | 'uncertain' // low confidence → show dropdown
  | 'rejected'; // not a civic issue → show reason + dropdown

interface ClassificationInfo {
  predictedClass: string | null;
  confidence: number | null;
  reason: string | null;
  category: string | null; // resolved backend category (null if needs manual pick)
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NewReport({ navigation }: any) {
  const [imageAsset, setImageAsset] = useState<Asset | null>(null);

  // ML classification state
  const [classStatus, setClassStatus] = useState<ClassificationStatus>('idle');
  const [classInfo, setClassInfo] = useState<ClassificationInfo>({
    predictedClass: null,
    confidence: null,
    reason: null,
    category: null,
  });

  // Fallback manual category (only used when status is uncertain / rejected)
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined,
  );

  const [paragraphText, setParagraphText] = useState('');
  const [showRecorder, setShowRecorder] = useState(false);
  const [submitting, setsubmitting] = useState(false);
  const { user } = useUser();

  // ── Permissions ─────────────────────────────────────────────────────────────

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const permission =
          Platform.Version >= 33
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
            : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

        const granted = await PermissionsAndroid.request(permission, {
          title: 'Storage Permission Required',
          message: 'This app needs access to your storage to upload photos.',
          buttonPositive: 'OK',
        });

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission request error:', err);
        return false;
      }
    }
    return true;
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'We need your location to create the report.',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Location permission error:', err);
        return false;
      }
    }
    return true;
  };

  // ── Location ─────────────────────────────────────────────────────────────────

  const getCurrentLocation = (): Promise<{
    latitude: number;
    longitude: number;
  }> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => resolve(position.coords),
        error => reject(error),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 },
      );
    });
  };

  // ── ML Classification ────────────────────────────────────────────────────────

  const classifyImage = async (asset: Asset) => {
    setClassStatus('classifying');
    setSelectedCategory(undefined);

    try {
      let fixedUri = asset.uri!;
      if (Platform.OS === 'ios' && fixedUri.startsWith('ph://')) {
        fixedUri = fixedUri.replace('ph://', 'assets-library://');
      }

      const filename = fixedUri.split('/').pop() || `photo_${Date.now()}.jpg`;

      const formData = new FormData();
      formData.append('file', {
        uri: fixedUri,
        name: filename,
        type: asset.type || 'image/jpeg',
      } as any);

      const response = await axios.post(ML_CLASSIFIER_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });

      const data = response.data;
      console.log('[ML Classify]', JSON.stringify(data));

      const status: string = data.status;
      const predictedClass: string | null = data.predicted_class ?? null;
      const confidence: number | null = data.confidence ?? null;
      const reason: string | null = data.reason ?? null;

      if (status === 'classified' && predictedClass) {
        const mappedCategory = CLASS_TO_CATEGORY[predictedClass];

        if (mappedCategory) {
          // Clean auto-classification
          setClassStatus('classified');
          setClassInfo({
            predictedClass,
            confidence,
            reason,
            category: mappedCategory,
          });
        } else {
          // predicted_class = "unknown" or unmapped → treat as uncertain
          setClassStatus('uncertain');
          setClassInfo({
            predictedClass,
            confidence,
            reason: 'Could not determine issue type — please select manually.',
            category: null,
          });
        }
      } else if (status === 'uncertain') {
        setClassStatus('uncertain');
        setClassInfo({ predictedClass, confidence, reason, category: null });
      } else {
        // status === 'rejected'
        setClassStatus('rejected');
        setClassInfo({
          predictedClass: null,
          confidence: null,
          reason,
          category: null,
        });
      }
    } catch (err: any) {
      console.warn('[ML Classify] Error:', err.message);
      // Network / timeout → graceful fallback to manual selection
      setClassStatus('uncertain');
      setClassInfo({
        predictedClass: null,
        confidence: null,
        reason:
          'Could not reach classifier — please select issue type manually.',
        category: null,
      });
    }
  };

  // ── Camera ───────────────────────────────────────────────────────────────────

  const openCamera = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Cannot proceed without storage permission.',
      );
      return;
    }

    const options: CameraOptions = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
    };

    try {
      const result = await launchCamera(options);

      if (result.didCancel) {
        console.log('User cancelled camera');
      } else if (result.errorMessage) {
        console.log('Camera Error: ', result.errorMessage);
        Alert.alert('Error', 'Failed to open camera');
      } else if (result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setImageAsset(asset);
        // 🤖 Trigger ML classification right after capture
        classifyImage(asset);
      }
    } catch (error) {
      console.log('Camera launch error: ', error);
      Alert.alert('Error', 'Failed to launch camera');
    }
  };

  const handleCameraPress = () => openCamera();

  // ── Submission ───────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!imageAsset) {
      Alert.alert('Photo Required', 'Please capture a photo of the issue.');
      return;
    }

    if (classStatus === 'classifying') {
      Alert.alert('Please wait', 'Image is still being analysed.');
      return;
    }

    // Resolve the final category
    const resolvedCategory =
      classStatus === 'classified'
        ? classInfo.category // auto from ML
        : selectedCategory; // manual fallback

    if (!resolvedCategory) {
      Alert.alert('Category Required', 'Please select an issue category.');
      return;
    }

    setsubmitting(true);
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        throw new Error('Location permission denied.');
      }
      const location = await getCurrentLocation();

      const photoUrl = await uploadMedia({
        mediaUri: imageAsset.uri!,
        mediaMimeType: imageAsset.type!,
        uploadType: 'photo',
      });

      const baseUrl = `${BACKEND_URL}/users/createReport`;
      const createReport = await axios.post(baseUrl, {
        user_id: user.user_id,
        photo_url: photoUrl,
        category: resolvedCategory,
        latitude: location.latitude,
        longitude: location.longitude,
        description: paragraphText,
        audio_url: '',
      });
      console.log(createReport);
    } catch (err: any) {
      console.error('Submission failed:', err);
      const errorMessage = err.message || 'An unknown error occurred.';
      Alert.alert('Submission Failed', errorMessage);
    } finally {
      setsubmitting(false);
      navigation.navigate('HomeScreen');
    }
  };

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const categoryLabel: Record<string, string> = {
    Road: '🛣️ Road Issue',
    Electricity: '⚡ Electricity Issue',
    Garbage: '🗑️ Garbage Dump',
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#667eea" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Report</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* ── Photo Section ── */}
            <View style={styles.cameraSection}>
              <Text style={styles.sectionLabel}>Photo Evidence</Text>
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={handleCameraPress}
                disabled={submitting || classStatus === 'classifying'}
              >
                {imageAsset ? (
                  <>
                    <Image
                      source={{ uri: imageAsset.uri }}
                      style={styles.previewImage}
                    />
                    <View style={styles.overlay}>
                      <Camera size={20} color="white" />
                      <Text style={styles.changeText}>Tap to change photo</Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.cameraPlaceholder}>
                    <View style={styles.cameraIconContainer}>
                      <Camera size={48} color="#667eea" />
                    </View>
                    <Text style={styles.cameraText}>Add Photo</Text>
                    <Text style={styles.cameraSubText}>
                      Tap to capture evidence
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* ── Classification Status Card ── */}
            {classStatus === 'classifying' && (
              <View style={[styles.statusCard, styles.statusCardAnalysing]}>
                <ActivityIndicator size="small" color="#667eea" />
                <Text style={[styles.statusText, { color: '#667eea' }]}>
                  Analysing image…
                </Text>
              </View>
            )}

            {classStatus === 'classified' && classInfo.category && (
              <View style={[styles.statusCard, styles.statusCardSuccess]}>
                <CheckCircle size={18} color="#38a169" />
                <View style={styles.statusTextBlock}>
                  <Text style={[styles.statusText, { color: '#276749' }]}>
                    {categoryLabel[classInfo.category] ?? classInfo.category}
                  </Text>
                  <Text style={styles.statusSub}>Auto-detected</Text>
                </View>
              </View>
            )}

            {classStatus === 'uncertain' && (
              <View style={[styles.statusCard, styles.statusCardWarn]}>
                <AlertTriangle size={18} color="#b7791f" />
                <View style={styles.statusTextBlock}>
                  <Text style={[styles.statusText, { color: '#7b341e' }]}>
                    Manual selection needed
                  </Text>
                  {classInfo.reason && (
                    <Text style={styles.statusSub}>{classInfo.reason}</Text>
                  )}
                </View>
              </View>
            )}

            {classStatus === 'rejected' && (
              <View style={[styles.statusCard, styles.statusCardError]}>
                <XCircle size={18} color="#c53030" />
                <View style={styles.statusTextBlock}>
                  <Text style={[styles.statusText, { color: '#742a2a' }]}>
                    Not recognised as a civic issue
                  </Text>
                  {classInfo.reason && (
                    <Text style={styles.statusSub}>{classInfo.reason}</Text>
                  )}
                </View>
              </View>
            )}

            {/* ── Category — auto badge or fallback dropdown ── */}
            {(classStatus === 'uncertain' || classStatus === 'rejected') && (
              <View style={styles.categorySection}>
                <Text style={styles.sectionLabel}>Category</Text>
                <View style={styles.dropdownContainer}>
                  <Picker
                    selectedValue={selectedCategory}
                    onValueChange={value => setSelectedCategory(value)}
                    style={styles.picker}
                    enabled={!submitting}
                  >
                    <Picker.Item
                      label="Select Category"
                      value={undefined}
                      style={styles.pickerItem}
                    />
                    <Picker.Item
                      label="🛣️ Road"
                      value="Road"
                      style={styles.pickerItem}
                    />
                    <Picker.Item
                      label="⚡ Electricity"
                      value="Electricity"
                      style={styles.pickerItem}
                    />
                    <Picker.Item
                      label="🗑️ Garbage"
                      value="Garbage"
                      style={styles.pickerItem}
                    />
                  </Picker>
                </View>
              </View>
            )}

            {/* ── Description ── */}
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionLabel}>Description</Text>
              {showRecorder ? (
                <View style={styles.recorderContainer}>
                  <AudioRecorder onClose={() => setShowRecorder(false)} />
                </View>
              ) : (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Describe the issue in detail..."
                    placeholderTextColor="#a0aec0"
                    multiline={true}
                    numberOfLines={4}
                    value={paragraphText}
                    onChangeText={setParagraphText}
                    editable={!submitting}
                  />
                  <TouchableOpacity
                    style={styles.micIcon}
                    onPress={() => setShowRecorder(true)}
                  >
                    <Mic size={22} color="#667eea" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* ── Submit ── */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                {
                  backgroundColor:
                    submitting || classStatus === 'classifying'
                      ? '#a0aec0'
                      : '#667eea',
                  opacity:
                    submitting || classStatus === 'classifying' ? 0.7 : 1,
                },
              ]}
              onPress={handleSubmit}
              disabled={submitting || classStatus === 'classifying'}
            >
              {submitting ? (
                <View style={styles.submitContent}>
                  <ActivityIndicator size="small" color="white" />
                  <Text style={styles.submitButtonText}>Submitting…</Text>
                </View>
              ) : (
                <Text style={styles.submitButtonText}>Submit Report</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
    fontSize: 20,
    fontWeight: '700',
    color: '#2d3748',
    flex: 1,
    marginHorizontal: 16,
  },
  headerSpacer: {
    width: 40,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  cameraSection: {
    marginBottom: 16,
  },
  categorySection: {
    marginBottom: 24,
  },
  descriptionSection: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 12,
    marginLeft: 4,
  },
  cameraButton: {
    width: '100%',
    height: 200,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cameraPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#edf2f7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cameraText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 4,
  },
  cameraSubText: {
    fontSize: 14,
    color: '#718096',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  // ── Classification Status Cards ──────────────────────────────────────────────
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statusCardAnalysing: {
    backgroundColor: '#ebf4ff',
    borderWidth: 1,
    borderColor: '#bee3f8',
  },
  statusCardSuccess: {
    backgroundColor: '#f0fff4',
    borderWidth: 1,
    borderColor: '#9ae6b4',
  },
  statusCardWarn: {
    backgroundColor: '#fffbeb',
    borderWidth: 1,
    borderColor: '#fbd38d',
  },
  statusCardError: {
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#feb2b2',
  },
  statusTextBlock: {
    flex: 1,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusSub: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  // ── Dropdown ─────────────────────────────────────────────────────────────────
  dropdownContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  picker: {
    height: 56,
    color: '#2d3748',
  },
  pickerItem: {
    fontSize: 16,
    color: '#2d3748',
  },
  // ── Description ──────────────────────────────────────────────────────────────
  recorderContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#2d3748',
    minHeight: 120,
    textAlignVertical: 'top',
    lineHeight: 22,
  },
  micIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#edf2f7',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    marginTop: 4,
  },
  // ── Submit ───────────────────────────────────────────────────────────────────
  submitButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginTop: 8,
  },
  submitContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
});
