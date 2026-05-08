// import Ionicons from '@react-native-vector-icons/ionicons';
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
import { Device } from 'react-native-ble-plx';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBle } from 'src/context/BleContext';

const AddDevicesTemplate: React.FC = () => {
  const { manager, connectDevice, connectedDevices, disconnectDevice } =
    useBle();

  const [devices, setDevices] = useState<Device[]>([]);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    startScan();

    return () => {
      manager.stopDeviceScan();
    };
  }, []);

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
  console.log('🚀 ~ AddDevicesScreen ~ availableDevices:', availableDevices);

  const connectedDevicesList = Array.from(connectedDevices.values());

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>BLE Devices</Text>

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

          {availableDevices.map(device => (
            <View key={device.id} style={styles.card}>
              <Text style={styles.name}>{device.name}</Text>
              <Text style={styles.name}>{device.id}</Text>
              <TouchableOpacity onPress={() => connectToDevice(device)}>
                <Text style={{ color: 'green' }}>
                  {loading === device.id ? '...' : 'CONNECT'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddDevicesTemplate;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#140e17' },
  title: { color: 'white', fontSize: 20, marginBottom: 10 },
  section: { color: '#aaa', marginTop: 20 },
  card: { padding: 12, backgroundColor: '#222', marginTop: 10 },
  cardConnected: { padding: 12, backgroundColor: '#1e3a1e', marginTop: 10 },
  name: { color: 'white' },
});
