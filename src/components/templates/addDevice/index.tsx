// import Ionicons from '@react-native-vector-icons/ionicons';
import BluetoothRequiredModal from '@/components/elements/common/BluetoothRequiredModal';
import { Colors } from '@/theme/colors';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  PermissionsAndroid,
  Permission,
  RefreshControl,
} from 'react-native';
import { Device, State } from 'react-native-ble-plx';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBle } from 'src/context/BleContext';

const AddDevicesTemplate: React.FC = () => {
  const { manager, connectDevice, connectedDevices, disconnectDevice } =
    useBle();

  const [devices, setDevices] = useState<Device[]>([]);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [bluetoothOn, setBluetoothOn] = useState(false);
  const [showBluetoothModal, setShowBluetoothModal] = useState(false);
  useEffect(() => {
    startScan();

    const subscription = manager.onStateChange(state => {
      const isOn = state === State.PoweredOn;

      setBluetoothOn(isOn);

      if (isOn) {
        setShowBluetoothModal(false);
        startScan();
      }
    }, true);

    return () => {
      manager.stopDeviceScan();
      subscription.remove();
    };
  }, []);

  const ensureBluetoothOn = async () => {
    const bluetoothState = await manager.state();

    const isOn = bluetoothState === State.PoweredOn;
    // console.log('🚀 ~ ensureBluetoothOn ~ isOn:', isOn);

    setBluetoothOn(isOn);

    if (!isOn) {
      setShowBluetoothModal(true);
    }

    return isOn;
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      let permissions: Permission[] = [];

      if (Platform.Version >= 31) {
        permissions.push(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        );
      }

      permissions.push(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

      const granted = await PermissionsAndroid.requestMultiple(permissions);

      return Object.values(granted).every(
        status => status === PermissionsAndroid.RESULTS.GRANTED,
      );
    }
    return true;
  };
  const startScan = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      Alert.alert('Permission Required');
      return;
    }
    const bluetoothEnabled = await ensureBluetoothOn();

    if (!bluetoothEnabled) {
      return;
    }
    setDevices([]);
    setScanning(true);
    setRefreshing(true);

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
        return;
      }

      if (device?.name) {
        setDevices(prev => {
          if (!prev.find(d => d.id === device.id)) {
            return [...prev, device];
          }
          return prev;
        });
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setScanning(false);
      setRefreshing(false);
    }, 8000);
  };

  const connectToDevice = async (device: Device) => {
    setLoading(device.id);
    await connectDevice(device);
    setLoading(null);
  };

  const disconnectFromDevice = async (id: string) => {
    setLoading(id);
    await disconnectDevice(id);
    setLoading(null);
  };

  const availableDevices = devices.filter(d => !connectedDevices.has(d.id));
  // console.log(
  //   '🚀 ~ AddDevicesScreen ~ availableDevices:',
  //   availableDevices,
  //   bluetoothOn,
  // );

  const connectedDevicesList = Array.from(connectedDevices.values());

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>BLE Devices</Text>

      {bluetoothOn ? (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={startScan} />
          }
        >
          {/* CONNECTED */}
          {connectedDevicesList.length > 0 && (
            <View>
              <Text style={styles.section}>Connected Devices</Text>

              {connectedDevicesList.map(device => (
                <View key={device.id} style={styles.cardConnected}>
                  <Text style={styles.name}>{device.name}</Text>
                  <Text style={styles.name}>{device.id}</Text>
                  <TouchableOpacity
                    onPress={() => disconnectFromDevice(device.id)}
                    hitSlop={10}
                  >
                    <Text style={{ color: 'red' }}>DISCONNECT</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* AVAILABLE */}
          <View>
            <Text style={styles.section}>Available Devices</Text>

            {scanning ? (
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Text style={{ color: Colors.white }}>
                  Scanning for Bluetooth devices...
                </Text>
              </View>
            ) : availableDevices.length > 0 ? (
              availableDevices.map(device => (
                <View key={device.id} style={styles.card}>
                  <Text style={styles.name}>{device.name}</Text>
                  <Text style={styles.name}>{device.id}</Text>

                  <TouchableOpacity onPress={() => connectToDevice(device)}>
                    <Text style={{ color: 'green' }}>
                      {loading === device.id ? '...' : 'CONNECT'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <Text style={{ color: Colors.white }}>
                  No Bluetooth Devices Found
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      ) : (
        <>
          <View
            style={{
              display: 'flex',
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* <Text style={{ color: Colors.white }}>
              Please enable Bluetooth to scan for nearby devices.
            </Text> */}

            <TouchableOpacity onPress={startScan}>
              <Text style={{ color: 'green' }}>
                Please enable Bluetooth to scan for nearby devices.
              </Text>
            </TouchableOpacity>
          </View>
          <BluetoothRequiredModal
            visible={showBluetoothModal}
            onClose={() => setShowBluetoothModal(false)}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default AddDevicesTemplate;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#140e17' },
  title: { color: Colors.white, fontSize: 20, marginBottom: 10 },
  section: { color: '#aaa', marginTop: 20 },
  card: { padding: 12, backgroundColor: '#222', marginTop: 10 },
  cardConnected: { padding: 12, backgroundColor: '#1e3a1e', marginTop: 10 },
  name: { color: Colors.white },
});
