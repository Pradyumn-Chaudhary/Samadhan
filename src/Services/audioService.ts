import { Platform, PermissionsAndroid } from 'react-native';

const requestAudioPermissions = async () => {
  if (Platform.OS !== 'android') {
    // iOS permissions are handled differently (Info.plist + runtime)
    return true;
  }

  try {
    // Check Android API level to determine permission strategy
    const androidVersion = Platform.Version;

    if (androidVersion >= 33) {
      // Android 13+ (API 33+) - Only need RECORD_AUDIO
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Audio Recording Permission',
          message: 'This app needs access to your microphone to record audio.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Recording permission granted');
        return true;
      } else {
        console.log('Recording permission denied');
        return false;
      }
    } else {
      // Android 12 and below - Need storage + audio permissions
      const grants = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);

      const allGranted =
        grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        grants['android.permission.READ_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        grants['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED;

      if (allGranted) {
        console.log('All permissions granted');
        return true;
      } else {
        console.log('All required permissions not granted');
        console.log('Granted permissions:', grants);
        return false;
      }
    }
  } catch (err) {
    console.warn('Permission request error:', err);
    return false;
  }
};

// Alternative approach: Check permissions first, then request what's needed
const checkAndRequestPermissions = async () => {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    const androidVersion = Platform.Version;

    if (androidVersion >= 33) {
      // Android 13+ - Check and request RECORD_AUDIO only
      const hasAudioPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );

      if (hasAudioPermission) {
        return true;
      }

      return await requestAudioPermissions();
    } else {
      // Android 12 and below - Check all required permissions
      const permissions = [
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ];

      const permissionChecks = await Promise.all(
        permissions.map(permission => PermissionsAndroid.check(permission)),
      );

      const allPermissionsGranted = permissionChecks.every(granted => granted);

      if (allPermissionsGranted) {
        return true;
      }

      return await requestAudioPermissions();
    }
  } catch (err) {
    console.warn('Permission check error:', err);
    return false;
  }
};

// Usage example
export const canStartRecording = async () => {
  const hasPermissions = await checkAndRequestPermissions();

  if (hasPermissions) {
    return true;
  } else {
    return false;
  }
};
