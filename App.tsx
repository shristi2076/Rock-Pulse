import React, { useEffect, useState } from 'react';
import {
  PermissionsAndroid,
  Platform,
  StatusBar,
  Text,
  Alert,
  View,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BleManager, State } from 'react-native-ble-plx';
import { BleProvider } from '@/context/BleContext';
import MainRouter from 'src/components/navigation';

const manager = new BleManager();

async function requestBluetoothPermissions(): Promise<boolean> {
  if (Platform.OS === 'ios') return true;

  const apiLevel = parseInt(Platform.Version.toString(), 10);

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

function App() {
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(
    null,
  );
  const [bluetoothOn, setBluetoothOn] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);

  const turnBluetoothOn = () => {
    Alert.alert(
      'Bluetooth is off',
      'Please turn on Bluetooth to scan for devices.',
      [
        { text: 'Cancel' },
        {
          text: 'Open Settings',
          onPress: () => {
            if (Platform.OS === 'ios') {
              Linking.openURL('App-Prefs:Bluetooth');
            } else {
              Linking.sendIntent('android.settings.BLUETOOTH_SETTINGS');
            }
          },
        },
      ],
    );
  };

  useEffect(() => {
    const init = async () => {
      const granted = await requestBluetoothPermissions();
      setPermissionGranted(granted);
      if (!granted) return;
    };

    init();

    //  Correct: rely ONLY on state listener
    const subscription = manager.onStateChange(state => {
      console.log('Bluetooth state:', state);
      setBluetoothOn(state === State.PoweredOn);
    }, true);

    // small delay to avoid flicker on reload
    const timer = setTimeout(() => setReady(true), 400);

    return () => {
      subscription.remove();
      clearTimeout(timer);

      //  avoid destroying in dev (fast refresh issue)
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
          <Text style={{ textAlign: 'center', marginBottom: 10 }}>
            Bluetooth permission is required to continue.
          </Text>
          <Text>Enable it from settings.</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  //  Bluetooth OFF
  if (!bluetoothOn) {
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
          <TouchableOpacity
            onPress={turnBluetoothOn}
            style={{ alignItems: 'center', marginBottom: 10 }}
          >
            <Text>Bluetooth is off. Please turn it on.</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaProvider>
    );
  }

  //  Main App
  return (
    <BleProvider>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" />
        <View style={{ flex: 1 }}>
          <MainRouter />
        </View>
      </SafeAreaProvider>
    </BleProvider>
  );
}

export default App;
