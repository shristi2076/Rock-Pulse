import BluetoothRequiredModal from '@/components/elements/common/BluetoothRequiredModal';
import { BleProvider } from '@/context/BleContext';
import { MusicPlayerProvider } from '@/context/MusicPlayerContext';
import { Colors } from '@/theme/colors';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  Linking,
  PermissionsAndroid,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BleManager, State } from 'react-native-ble-plx';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MainRouter from 'src/components/navigation';

const manager = new BleManager();

async function requestBluetoothPermissions(): Promise<boolean> {
  if (Platform.OS === 'ios') return true;

  const apiLevel = parseInt(Platform.Version.toString(), 10);
  console.log('🚀 ~ requestBluetoothPermissions ~ apiLevel:', apiLevel);

  if (apiLevel < 31) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } else {
    const result = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    ]);

    return (
      result['android.permission.BLUETOOTH_SCAN'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      result['android.permission.BLUETOOTH_CONNECT'] ===
        PermissionsAndroid.RESULTS.GRANTED
    );
  }
}
async function checkBluetoothPermissions(): Promise<boolean> {
  if (Platform.OS === 'ios') return true;

  const apiLevel = Number(Platform.Version);

  if (apiLevel < 31) {
    return PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
  }

  const scanGranted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
  );

  const connectGranted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
  );

  return scanGranted && connectGranted;
}

function App() {
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(
    null,
  );
  const [bluetoothOn, setBluetoothOn] = useState<boolean | null>(null);
  const [showBluetoothModal, setShowBluetoothModal] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      const granted = await requestBluetoothPermissions();
      setPermissionGranted(granted);
    };

    init();

    const bleSubscription = manager.onStateChange(state => {
      const isOn = state === State.PoweredOn;

      setBluetoothOn(isOn);
      setShowBluetoothModal(!isOn);
    }, true);

    const appStateSubscription = AppState.addEventListener(
      'change',
      async state => {
        if (state === 'active') {
          const granted = await checkBluetoothPermissions();
          setPermissionGranted(granted);

          const bleState = await manager.state();
          setBluetoothOn(bleState === State.PoweredOn);
        }
      },
    );

    const timer = setTimeout(() => {
      setReady(true);
    }, 400);

    return () => {
      bleSubscription.remove();
      appStateSubscription.remove();
      clearTimeout(timer);

      if (!__DEV__) {
        manager.destroy();
      }
    };
  }, []);

  //  Loading state
  if (!ready || permissionGranted === null || bluetoothOn === null) {
    return (
      <SafeAreaProvider>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 10 }}>
            Checking permissions & Bluetooth...
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  // Permission denied
  if (!permissionGranted) {
    return (
      <SafeAreaProvider>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <Text
            style={{ textAlign: 'center', marginBottom: 10, color: 'white' }}
          >
            Nearby devices permission is required to continue.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => Linking.openSettings()}
          >
            <Text style={styles.buttonText}>Open App Settings</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaProvider>
    );
  }
  // if (showBluetoothModal) {
  //   if (Platform.OS === 'android') {
  //     BluetoothStateManager.requestToEnable();
  //   } else {
  //     Linking.openURL('App-Prefs:Bluetooth');
  //   }
  // }

  //  Bluetooth OFF
  // if (!bluetoothOn) {
  //   return (
  //     <SafeAreaProvider>
  //       <View
  //         style={{
  //           flex: 1,
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //           padding: 20,
  //         }}
  //       >
  //         <TouchableOpacity
  //           onPress={turnBluetoothOn}
  //           style={{ alignItems: 'center', marginBottom: 10 }}
  //         >
  //           <Text>Bluetooth is off. Please turn it on.</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </SafeAreaProvider>
  //   );
  // }

  //  Main App
  return (
    <BleProvider>
      <MusicPlayerProvider>
        <SafeAreaProvider>
          <StatusBar barStyle="dark-content" />
          <View style={{ flex: 1 }}>
            <MainRouter />
          </View>
        </SafeAreaProvider>
      </MusicPlayerProvider>
      <BluetoothRequiredModal
        visible={showBluetoothModal}
        onClose={() => setShowBluetoothModal(false)}
      />
    </BleProvider>
  );
}

export default App;
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    borderRadius: 20,
    padding: 24,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '600',
  },
});
