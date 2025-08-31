import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Camera, Mic } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import AudioRecorder from '../Components/AudioRecorder';
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
} from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { canStartRecording } from '../Services/audioService';

export default function NewReport() {
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState();
  const [paragraphText, setParagraphText] = useState('');
  const [showRecorder, setShowRecorder] = useState(false);

  const handleCameraPress = () => {
    openCamera();
  };

  const openCamera = async () => {
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
        setImageUri(result.assets[0].uri || null);
      }
    } catch (error) {
      console.log('Camera launch error: ', error);
      Alert.alert('Error', 'Failed to launch camera');
    }
  };

  const handleMicPress = () => {
    openRecorder();
  };

  const openRecorder = async () => {
    const canRecord = canStartRecording();
    if (!canRecord) {
      Alert.alert('Permission Required for Recording');
      return;
    }
    setShowRecorder(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Report</Text>
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
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={handleCameraPress}
            >
              {imageUri ? (
                <>
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.previewImage}
                  />
                  <View style={styles.overlay}>
                    <Text style={styles.changeText}>Tap to change photo</Text>
                  </View>
                </>
              ) : (
                <>
                  <Camera size={64} color="black" />
                  <Text style={styles.cameraText}>Add Photo</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Category Dropdown */}
            <View style={styles.dropdownContainer}>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={value => setSelectedCategory(value)}
                style={styles.picker}
              >
                <Picker.Item label="Select Category" value={null} />
                <Picker.Item label="Road" value="Road" />
                <Picker.Item label="Electricity" value="Electricity" />
                <Picker.Item label="Garbage" value="Garbage" />
              </Picker>
            </View>

            {/* Text Input with Mic Icon */}
            {showRecorder ? (
              // <AudioRecorder />
              <AudioRecorder onClose={() => setShowRecorder(false)} />
            ) : (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter a short paragraph or context..."
                  multiline={true}
                  numberOfLines={4}
                  value={paragraphText}
                  onChangeText={setParagraphText}
                />
                {/* <TouchableOpacity style={styles.micIcon} onPress={()=>setShowRecorder(true)}>
                  <Mic size={24} color="#007bff" />
                </TouchableOpacity> */}
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Submit Report</Text>
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  cameraButton: {
    width: '100%',
    height: 180,
    backgroundColor: '#e9ecef',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 2,
    borderColor: '#ccc',
    position: 'relative',
    overflow: 'hidden',
  },
  cameraText: {
    marginTop: 8,
    fontSize: 16,
    color: '#555',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    alignItems: 'center',
  },
  changeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  dropdownContainer: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  micIcon: {
    padding: 6,
    marginLeft: 8,
    backgroundColor: '#e7f1ff',
    borderRadius: 50,
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
