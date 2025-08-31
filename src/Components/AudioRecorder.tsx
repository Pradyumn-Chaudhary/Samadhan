import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Mic, Square, Play, X } from 'lucide-react-native';

export default function AudioRecorder({ onClose }: { onClose: () => void }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Audio Recorder</Text>
        <TouchableOpacity onPress={onClose}>
          <X size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Main Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton}>
          <Mic size={36} color="red" />
          <Text style={styles.label}>Record</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <Square size={36} color="black" />
          <Text style={styles.label}>Stop</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <Play size={36} color="green" />
          <Text style={styles.label}>Play</Text>
        </TouchableOpacity>
      </View>

      {/* Timer / Status */}
      <View style={styles.footer}>
        <Text style={styles.timer}>00:00</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 30,
  },
  controlButton: {
    alignItems: 'center',
  },
  label: {
    marginTop: 6,
    fontSize: 14,
    color: '#333',
  },
  footer: {
    alignItems: 'center',
  },
  timer: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Button,
//   Text,
//   ActivityIndicator,
//   StyleSheet,
// } from 'react-native';
// import AudioRecorderPlayer, {
//   PlayBackType,
//   AudioEncoderAndroidType,
//   AudioSourceAndroidType,
//   AudioSet,
//   AVEncoderAudioQualityIOSType,
// } from 'react-native-audio-recorder-player';

// interface AudioRecorderProps {
//   onRecordingComplete?: (uri: string) => void;
// }

// export const AudioRecorder: React.FC<AudioRecorderProps> = ({
//   onRecordingComplete,
// }) => {
//   const audioRecorderPlayer = AudioRecorderPlayer;

//   // Recording states
//   const [isRecording, setIsRecording] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [recordTime, setRecordTime] = useState('00:00:00');
//   const [recordedUri, setRecordedUri] = useState<string | null>(null);

//   // Playback states
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [playTime, setPlayTime] = useState('00:00:00');
//   const [duration, setDuration] = useState('00:00:00');
//   const [currentPosition, setCurrentPosition] = useState(0);
//   const [totalDuration, setTotalDuration] = useState(0);

//   useEffect(() => {
//     return () => {
//       // Cleanup on unmount
//       audioRecorderPlayer.removeRecordBackListener();
//       audioRecorderPlayer.removePlayBackListener();
//       audioRecorderPlayer.stopRecorder();
//       audioRecorderPlayer.stopPlayer();
//     };
//   }, [audioRecorderPlayer]);

//   const onStartRecord = async () => {
//     setIsLoading(true);
//     try {
//       const audioSet: AudioSet = {
//         AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
//         AudioSourceAndroid: AudioSourceAndroidType.MIC,
//         AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
//         AVNumberOfChannelsKeyIOS: 2,
//         AVFormatIDKeyIOS: 'mp4',
//       };

//       const meteringEnabled = true;

//       const result = await audioRecorderPlayer.startRecorder(
//         undefined, // Use default path
//         audioSet,
//         meteringEnabled,
//       );

//       audioRecorderPlayer.addRecordBackListener(e => {
//         setRecordTime(
//           audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
//         );
//       });

//       setIsRecording(true);
//       setRecordedUri(result);
//       console.log('Recording started:', result);
//     } catch (error) {
//       console.error('Failed to start recording:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const onStopRecord = async () => {
//     setIsLoading(true);
//     try {
//       const result = await audioRecorderPlayer.stopRecorder();
//       audioRecorderPlayer.removeRecordBackListener();
//       setIsRecording(false);
//       setIsPaused(false);
//       setRecordedUri(result);
//       onRecordingComplete?.(result);
//       console.log('Recording stopped:', result);
//     } catch (error) {
//       console.error('Failed to stop recording:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const onPauseRecord = async () => {
//     try {
//       await audioRecorderPlayer.pauseRecorder();
//       setIsPaused(true);
//       console.log('Recording paused');
//     } catch (error) {
//       console.error('Failed to pause recording:', error);
//     }
//   };

//   const onResumeRecord = async () => {
//     try {
//       await audioRecorderPlayer.resumeRecorder();
//       setIsPaused(false);
//       console.log('Recording resumed');
//     } catch (error) {
//       console.error('Failed to resume recording:', error);
//     }
//   };

//   // Playback functions
//   const onStartPlay = async () => {
//     if (!recordedUri) {
//       console.log('No recording to play');
//       return;
//     }

//     try {
//       setIsLoading(true);

//       // Set up playback progress listener
//       audioRecorderPlayer.addPlayBackListener((e: PlayBackType) => {
//         setCurrentPosition(e.currentPosition);
//         setTotalDuration(e.duration);
//         setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
//         setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));

//         // Auto-stop when playback completes
//         if (e.currentPosition >= e.duration && e.duration > 0) {
//           onStopPlay();
//         }
//       });

//       const result = await audioRecorderPlayer.startPlayer(recordedUri);
//       setIsPlaying(true);
//       console.log('Playback started:', result);
//     } catch (error) {
//       console.error('Failed to start playback:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const onPausePlay = async () => {
//     try {
//       await audioRecorderPlayer.pausePlayer();
//       setIsPlaying(false);
//       console.log('Playback paused');
//     } catch (error) {
//       console.error('Failed to pause playback:', error);
//     }
//   };

//   const onStopPlay = async () => {
//     try {
//       await audioRecorderPlayer.stopPlayer();
//       audioRecorderPlayer.removePlayBackListener();
//       setIsPlaying(false);
//       setCurrentPosition(0);
//       setPlayTime('00:00:00');
//       console.log('Playback stopped');
//     } catch (error) {
//       console.error('Failed to stop playback:', error);
//     }
//   };

//   const seekTo = async (milliseconds: number) => {
//     try {
//       await audioRecorderPlayer.seekToPlayer(milliseconds);
//     } catch (error) {
//       console.error('Failed to seek:', error);
//     }
//   };

//   const setVolume = async (volume: number) => {
//     try {
//       await audioRecorderPlayer.setVolume(volume); // 0.0 - 1.0
//     } catch (error) {
//       console.error('Failed to set volume:', error);
//     }
//   };

//   const setSpeed = async (speed: number) => {
//     try {
//       await audioRecorderPlayer.setPlaybackSpeed(speed); // 0.5 - 2.0
//     } catch (error) {
//       console.error('Failed to set speed:', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Recording Section */}
//       <View style={styles.section}>
//         <Text style={styles.title}>Recording</Text>
//         <Text style={styles.timeText}>{recordTime}</Text>

//         <View style={styles.buttonRow}>
//           <Button
//             title={isRecording ? 'Stop' : 'Start Recording'}
//             onPress={isRecording ? onStopRecord : onStartRecord}
//             disabled={isLoading}
//           />

//           {isRecording && (
//             <Button
//               title={isPaused ? 'Resume' : 'Pause'}
//               onPress={isPaused ? onResumeRecord : onPauseRecord}
//               disabled={isLoading}
//             />
//           )}
//         </View>
//       </View>

//       {/* Playback Section */}
//       {recordedUri && (
//         <View style={styles.section}>
//           <Text style={styles.title}>Playback</Text>
//           <Text style={styles.timeText}>
//             {playTime} / {duration}
//           </Text>

//           <View style={styles.buttonRow}>
//             <Button
//               title={isPlaying ? 'Pause' : 'Play'}
//               onPress={isPlaying ? onPausePlay : onStartPlay}
//               disabled={isLoading}
//             />

//             <Button
//               title="Stop"
//               onPress={onStopPlay}
//               disabled={isLoading || !isPlaying}
//             />
//           </View>

//           {/* Seek bar (simple version) */}
//           {totalDuration > 0 && (
//             <View style={styles.seekContainer}>
//               <Text style={styles.seekText}>
//                 Progress: {Math.round((currentPosition / totalDuration) * 100)}%
//               </Text>
//             </View>
//           )}
//         </View>
//       )}

//       {/* Loading indicator */}
//       {isLoading && (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="small" />
//           <Text>Processing...</Text>
//         </View>
//       )}

//       {/* Control buttons for advanced features */}
//       {recordedUri && (
//         <View style={styles.section}>
//           <Text style={styles.title}>Controls</Text>
//           <View style={styles.buttonRow}>
//             <Button title="50% Speed" onPress={() => setSpeed(0.5)} />
//             <Button title="Normal Speed" onPress={() => setSpeed(1.0)} />
//             <Button title="2x Speed" onPress={() => setSpeed(2.0)} />
//           </View>
//           <View style={styles.buttonRow}>
//             <Button title="50% Volume" onPress={() => setVolume(0.5)} />
//             <Button title="100% Volume" onPress={() => setVolume(1.0)} />
//           </View>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   section: {
//     marginBottom: 20,
//     padding: 15,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   timeText: {
//     fontSize: 24,
//     fontFamily: 'monospace',
//     textAlign: 'center',
//     marginBottom: 15,
//     color: '#333',
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 10,
//   },
//   loadingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 10,
//   },
//   seekContainer: {
//     marginTop: 10,
//     alignItems: 'center',
//   },
//   seekText: {
//     fontSize: 14,
//     color: '#666',
//   },
// });
