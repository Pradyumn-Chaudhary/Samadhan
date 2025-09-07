import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Camera, Mic } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
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
import { canStartRecording } from '../Services/audioService';
import { BACKEND_URL } from '@env';
import axios from 'axios';

export default function NewReport({ navigation }: any) {
  const [imageAsset, setImageAsset] = useState<Asset | null>(null);
  const [selectedCategory, setSelectedCategory] = useState();
  const [paragraphText, setParagraphText] = useState('');
  const [showRecorder, setShowRecorder] = useState(false);
  const [submitting, setsubmitting] = useState(false);
  const { user } = useUser();

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          // Important: For newer Android versions, this permission might not be sufficient
          // or required depending on your target SDK. This is a common starting point.
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'This app needs access to your storage to upload photos.',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission request error:', err);
        return false;
      }
    }
    return true; // No explicit permission needed on iOS for this flow
  };

  const handleCameraPress = () => {
    openCamera();
  };

  const openCamera = async () => {
    // First, check for storage permission
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
      // To save the captured Image into Storage
      // saveToPhotos: true
    };

    try {
      const result = await launchCamera(options);

      if (result.didCancel) {
        console.log('User cancelled camera');
      } else if (result.errorMessage) {
        console.log('Camera Error: ', result.errorMessage);
        Alert.alert('Error', 'Failed to open camera');
      } else if (result.assets && result.assets[0]) {
        setImageAsset(result.assets[0]);
      }
    } catch (error) {
      console.log('Camera launch error: ', error);
      Alert.alert('Error', 'Failed to launch camera');
    }
  };

  const handleSubmit = async () => {
    if (!imageAsset || !selectedCategory) {
      Alert.alert('Image and Category Required');
      return;
    }
    setsubmitting(true);
    try {
      const photoUrl = await uploadMedia({
        mediaUri: imageAsset.uri!,
        mediaMimeType: imageAsset.type!,
        uploadType: 'photo',
      });
      const baseUrl = `${BACKEND_URL}/users/createReport`;
      const createReport = await axios.post(`${baseUrl}`, {
        //TODO
        user_id: "681c81eb-6639-49a8-9efe-54ebb6b1c20f",
        photo_url: photoUrl,
        category: selectedCategory,
        // Hardcoded Jodhpur location as requested for testing
        longitude: 26.2389,
        latitude: 73.0243,
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

  // *: Uncomment when using mic
  // const openRecorder = async () => {
  //   const canRecord = canStartRecording();
  //   if (!canRecord) {
  //     Alert.alert('Permission Required for Recording');
  //     return;
  //   }
  //   setShowRecorder(true);
  // };

  // const handleMicPress = () => {
  //   openRecorder();
  // };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button */}
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
            {/* Camera Button (large rectangle) */}
            <View style={styles.cameraSection}>
              <Text style={styles.sectionLabel}>Photo Evidence</Text>
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={handleCameraPress}
                disabled={submitting}
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

            {/* Category Dropdown */}
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
                    value={null}
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

            {/* Text Input with Mic Icon */}
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
                  {/* <TouchableOpacity style={styles.micIcon} onPress={()=>setShowRecorder(true)}>
                    <Mic size={22} color="#667eea" />
                  </TouchableOpacity> */}
                </View>
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                {
                  backgroundColor: submitting ? '#a0aec0' : '#667eea',
                  opacity: submitting ? 0.7 : 1,
                },
              ]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <View style={styles.submitContent}>
                  <ActivityIndicator size="small" color="white" />
                  <Text style={styles.submitButtonText}>Submitting...</Text>
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
    textAlign: 'center',
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
    marginBottom: 32,
  },
  categorySection: {
    marginBottom: 32,
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
    marginTop: 20,
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
