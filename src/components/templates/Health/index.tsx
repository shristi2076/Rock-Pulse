/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import {
  InteractionManager,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { HomeStackParamList } from '@/components/navigation/HomeStack/HomeStack';
import Ionicons from '@react-native-vector-icons/ionicons';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBle } from 'src/context/BleContext';
import DeviceIcon from '@/components/elements/CustomIcons';
import {
  getBatteryLevel,
  getCurrentSteps,
  getMonitorBloodPressure,
  monitorBatteryLevel,
  monitoringHeartRate,
  monitorSteps,
} from 'src/services/bleServices';
import { Buffer } from 'buffer';

type DeviceDetailRouteProp = RouteProp<HomeStackParamList, 'DeviceDetailTab'>;

const HealthTemplate = ({ route }: { route: DeviceDetailRouteProp }) => {
  const { id, name } = route.params;
  const batterySubscription = useRef<any>(null);
  const hrSubscription = useRef<any>(null);
  const stepsSubscription = useRef<any>(null);
  const bPSubscription = useRef<any>(null);

  const navigation = useNavigation();
  const { connectedDevices } = useBle();

  const [battery, setBattery] = useState<number | null>(null);
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [loadingBattery, setLoadingBattery] = useState(true);
  const [stepsData, setStepsData] = useState<{
    steps: number;
    calories: number;
    distanceKm: number;
  } | null>(null);
  const [bPData, setBPData] = useState<{
    systolic: number;
    diastolic: number;
  } | null>(null);
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);

  const [ancEnabled, setAncEnabled] = useState(true);
  const [encEnabled, setEncEnabled] = useState(true);
  const [soundEffect, setSoundEffect] = useState('Hifi');

  const soundModes = ['Classic', 'Mega Bass', 'Theater', 'Hifi'];

  const onBack = () => navigation.goBack();

  // ✅ Fetch battery automatically on screen load
  // useEffect(() => {
  //   const fetchBatteryAndHR = async () => {
  //     const device = connectedDevices.get(id);

  //     if (!device) {
  //       console.log('❌ Device not found');
  //       setLoadingBattery(false);
  //       return;
  //     }

  //     try {
  //       const allservices =
  //         await device.discoverAllServicesAndCharacteristics(); // ✅ REQUIRED
  //       console.log('allservices', allservices);

  //       const services = [
  //         '0000fee7-0000-1000-8000-00805f9b34fb',
  //         '0000feea-0000-1000-8000-00805f9b34fb',
  //       ];

  //       for (const s of services) {
  //         const chars = await device.characteristicsForService(s);
  //         console.log('SERVICE:', s);

  //         chars.forEach(c => {
  //           console.log(
  //             'CHAR:',
  //             c.uuid,
  //             'isNotifiable',
  //             c.isNotifiable,
  //             'isReadable',
  //             c.isReadable,
  //             c.isWritableWithResponse,
  //           );
  //         });
  //       }

  //       // ✅ Battery
  //       const level = await getBatteryLevel(device);
  //       setBattery(level);
  //       batterySubscription.current = monitorBatteryLevel(
  //         device,
  //         batterystatus => {
  //           setBattery(batterystatus);
  //         },
  //       );

  //       // ✅ Heart Rate (DO NOT REMOVE IMMEDIATELY)
  //       hrSubscription.current = monitoringHeartRate(device, hr => {
  //         console.log('Heart Rate:', hr);
  //         setHeartRate(hr);
  //       });

  //       //steps
  //       const current = await getCurrentSteps(device);
  //       setStepsData(current);
  //       stepsSubscription.current = monitorSteps(device, step => {
  //         setStepsData(step);
  //       });

  //       bPSubscription.current = await getMonitorBloodPressure(device, bp => {
  //         setBPData(bp);
  //       });
  //     } catch (err) {
  //       console.log('Error:', err);
  //     } finally {
  //       setLoadingBattery(false);
  //     }
  //   };

  //   fetchBatteryAndHR();

  //   // ✅ Cleanup ONLY when component unmounts
  //   return () => {
  //     hrSubscription.current?.remove();
  //     stepsSubscription.current?.remove();
  //   };
  // }, [id, connectedDevices]);

  const sendCommand = async (bytes: number[]) => {
    try {
      const device = connectedDevices.get(id);

      if (!device) return;

      const base64 = Buffer.from(bytes).toString('base64');

      await device.writeCharacteristicWithoutResponseForService(
        '0000feea-0000-1000-8000-00805f9b34fb',
        '0000fee2-0000-1000-8000-00805f9b34fb',
        base64,
      );

      console.log('SENT CMD:', bytes);
    } catch (e) {
      console.log('SEND CMD ERROR:', e);
    }
  };

  useEffect(() => {
    let interactionTask: any;

    const fetchBatteryAndHR = async () => {
      const device = connectedDevices.get(id);

      if (!device) {
        setLoadingBattery(false);
        return;
      }

      try {
        const allservices =
          await device.discoverAllServicesAndCharacteristics(); // ✅ REQUIRED
        console.log('allservices', allservices);

        const services = [
          '0000fee7-0000-1000-8000-00805f9b34fb',
          '0000feea-0000-1000-8000-00805f9b34fb',
        ];

        for (const s of services) {
          const chars = await device.characteristicsForService(s);
          console.log('SERVICE:', s);

          chars.forEach(c => {
            console.log({
              uuid: c.uuid,
              isReadable: c.isReadable,
              isWritableWithResponse: c.isWritableWithResponse,
              isWritableWithoutResponse: c.isWritableWithoutResponse,
              isNotifiable: c.isNotifiable,
              isIndicatable: c.isIndicatable,
            });
          });
        }

        // Battery
        const level = await getBatteryLevel(device);
        setBattery(level);

        batterySubscription.current = monitorBatteryLevel(
          device,
          batterystatus => {
            setBattery(batterystatus);
          },
        );

        // Heart Rate
        hrSubscription.current = monitoringHeartRate(device, hr => {
          setHeartRate(hr);
        });

        // Steps
        const current = await getCurrentSteps(device);

        setStepsData(current);

        stepsSubscription.current = monitorSteps(device, step => {
          setStepsData(step);
        });

        // Blood Pressure
        bPSubscription.current = await getMonitorBloodPressure(device, bp => {
          setBPData(bp);
        });
        const addRawMonitor = (
          service: string,
          char: string,
          label: string,
        ) => {
          return device.monitorCharacteristicForService(
            service,
            char,
            (error, c) => {
              if (error || !c?.value) {
                console.log(' log monitor Error:', error);
                return;
              }

              const data = Buffer.from(c.value, 'base64');

              console.log(label, {
                hex: data.toString('hex'),
                bytes: [...data],
              });

              setHistoryLogs(prev => {
                const updated = [
                  ...prev,
                  {
                    label,
                    hex: data.toString('hex'),
                    bytes: [...data],
                    time: Date.now(),
                  },
                ];

                return updated.slice(-30);
              });
            },
          );
        };

        addRawMonitor(
          '0000feea-0000-1000-8000-00805f9b34fb',
          '0000fee1-0000-1000-8000-00805f9b34fb',
          'FEE1',
        );

        addRawMonitor(
          '0000fee7-0000-1000-8000-00805f9b34fb',
          '0000fea1-0000-1000-8000-00805f9b34fb',
          'FEA1',
        );

        addRawMonitor(
          '0000feea-0000-1000-8000-00805f9b34fb',
          '0000fee3-0000-1000-8000-00805f9b34fb',
          'FEE3',
        );
      } catch (err) {
        console.log('Error:', err);
      } finally {
        setLoadingBattery(false);
      }
    };

    interactionTask = InteractionManager.runAfterInteractions(() => {
      fetchBatteryAndHR();
    });

    return () => {
      if (interactionTask && typeof interactionTask.cancel === 'function') {
        interactionTask.cancel();
      }

      if (
        batterySubscription.current &&
        typeof batterySubscription.current.remove === 'function'
      ) {
        batterySubscription.current.remove();
      }

      if (
        hrSubscription.current &&
        typeof hrSubscription.current.remove === 'function'
      ) {
        hrSubscription.current.remove();
      }

      if (
        stepsSubscription.current &&
        typeof stepsSubscription.current.remove === 'function'
      ) {
        stepsSubscription.current.remove();
      }

      if (
        bPSubscription.current &&
        typeof bPSubscription.current.remove === 'function'
      ) {
        bPSubscription.current.remove();
      }
    };
  }, [connectedDevices, id]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ height: 56, justifyContent: 'center' }}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          style={[
            styles.backBtn,
            { position: 'absolute', left: 0, zIndex: 10 },
          ]}
        >
          <Ionicons name="chevron-back-outline" color={'#FBFBFB'} size={20} />
        </TouchableOpacity>

        <Text style={styles.headerTitle} pointerEvents="none">
          {name}
        </Text>
      </View>
      <ScrollView>
        <View style={styles.imageBox}>
          <DeviceIcon name="move" />

          <Text style={styles.caseBattery}>BATTERY</Text>

          <Text
            style={[
              styles.caseBatteryPercent,
              battery !== null && battery > 100 && { color: 'green' },
            ]}
          >
            {loadingBattery
              ? 'Loading...'
              : battery !== null
              ? battery > 100
                ? 'Charging'
                : `${battery}%`
              : 'N/A'}
          </Text>
        </View>
        <View style={styles.imageBox}>
          <Text style={styles.caseBattery}>Heart Rate </Text>

          <Text
            style={[
              styles.caseBatteryPercent,
              // battery !== null && battery > 100 && { color: 'green' },
            ]}
          >
            {loadingBattery
              ? 'Loading...'
              : heartRate !== null
              ? ` ${heartRate} bpm`
              : 'N/A'}
          </Text>
        </View>
        <View style={styles.imageBox}>
          <Text style={styles.caseBattery}>Blood Pressure</Text>

          <Text
            style={[
              styles.caseBatteryPercent,
              battery !== null && battery > 100 && { color: 'green' },
            ]}
          >
            {loadingBattery
              ? 'Loading...'
              : bPData !== null
              ? `${bPData.systolic} - ${bPData.diastolic} mmHg`
              : 'N/A'}
          </Text>
        </View>
        <View style={styles.imageBox}>
          <View>
            <Text style={styles.caseBattery}>Steps count</Text>

            <Text
              style={[
                styles.caseBatteryPercent,
                // battery !== null && battery > 100 && { color: 'green' },
              ]}
            >
              {loadingBattery
                ? 'Loading...'
                : stepsData !== null
                ? ` ${stepsData.steps} steps`
                : 'N/A'}
            </Text>
          </View>
          <View>
            <Text style={styles.caseBattery}>Calorie count</Text>

            <Text
              style={[
                styles.caseBatteryPercent,
                // battery !== null && battery > 100 && { color: 'green' },
              ]}
            >
              {loadingBattery
                ? 'Loading...'
                : stepsData !== null
                ? ` ${stepsData.calories} cal`
                : 'N/A'}
            </Text>
          </View>
          <View>
            <Text style={styles.caseBattery}>Distance count</Text>

            <Text
              style={[
                styles.caseBatteryPercent,
                // battery !== null && battery > 100 && { color: 'green' },
              ]}
            >
              {loadingBattery
                ? 'Loading...'
                : stepsData !== null
                ? ` ${stepsData.distanceKm} km`
                : 'N/A'}
            </Text>
          </View>
        </View>
        <View style={styles.imageBox}>
          <Text style={styles.caseBattery}>History Sync</Text>

          <TouchableOpacity
            style={styles.syncBtn}
            onPress={() => sendCommand([0x5a, 0x05, 0x00, 0x01])}
          >
            <Text style={styles.syncBtnText}>
              sendCommand([0x5A, 0x05, 0x00, 0x01]);
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.syncBtn}
            onPress={() => sendCommand([0xa5, 0x01, 0x00])}
          >
            <Text style={styles.syncBtnText}>
              sendCommand([0xA5, 0x01, 0x00])
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.syncBtn}
            onPress={() => sendCommand([0x5a, 0x03, 0x01])}
          >
            <Text style={styles.syncBtnText}>
              SsendCommand([0x5A, 0x03, 0x01])
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.imageBox}>
          <Text style={styles.caseBattery}>BLE Logs</Text>

          {historyLogs.slice(-10).map((item, index) => (
            <Text
              key={index}
              style={{
                color: 'white',
                fontSize: 12,
                marginTop: 6,
              }}
            >
              {item.hex}
            </Text>
          ))}
        </View>
        {/* ANC */}
        <View style={styles.optionBox}>
          <Text style={styles.optionLabel}>ANC</Text>
          <Switch value={ancEnabled} onValueChange={setAncEnabled} />
        </View>
        {/* ENC */}
        <View style={styles.optionBox}>
          <Text style={styles.optionLabel}>ENC</Text>
          <Switch value={encEnabled} onValueChange={setEncEnabled} />
        </View>
        {/* ANC */}
        {/* <View style={styles.optionBox}>
          <Text style={styles.optionLabel}>ANC</Text>
          <Switch value={ancEnabled} onValueChange={setAncEnabled} />
        </View>
        <View style={styles.optionBox}>
          <Text style={styles.optionLabel}>ENC</Text>
          <Switch value={encEnabled} onValueChange={setEncEnabled} />
        </View>
        <View style={styles.optionBox}>
          <Text style={styles.optionLabel}>ANC</Text>
          <Switch value={ancEnabled} onValueChange={setAncEnabled} />
        </View>
        <View style={styles.optionBox}>
          <Text style={styles.optionLabel}>ENC</Text>
          <Switch value={encEnabled} onValueChange={setEncEnabled} />
        </View>
        <View style={styles.optionBox}>
          <Text style={styles.optionLabel}>ANC</Text>
          <Switch value={ancEnabled} onValueChange={setAncEnabled} />
        </View>
        <View style={styles.optionBox}>
          <Text style={styles.optionLabel}>ENC</Text>
          <Switch value={encEnabled} onValueChange={setEncEnabled} />
        </View> */}
        {/* Sound Effects */}
        <View style={styles.soundEffectBox}>
          <View style={styles.soundHeader}>
            <Text style={styles.optionLabel}>Sound Effect</Text>
            <Text style={styles.customize}>Customize ▾</Text>
          </View>

          <View style={styles.soundOptions}>
            {soundModes.map(mode => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.soundBtn,
                  soundEffect === mode && styles.soundBtnActive,
                ]}
                onPress={() => setSoundEffect(mode)}
              >
                <Text
                  style={[
                    styles.soundText,
                    soundEffect === mode && styles.soundTextActive,
                  ]}
                >
                  {mode}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HealthTemplate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0B14',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    paddingVertical: 10,
    alignItems: 'center',
    borderColor: '#232323',
    borderRadius: 12,
    borderWidth: 1,
  },
  backArrow: {
    fontSize: 22,
    color: '#fff',
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#FBFBFB',
  },
  imageBox: {
    alignItems: 'center',
    backgroundColor: '#1C1B22',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 10,
  },
  caseBattery: {
    color: '#aaa',
    fontSize: 14,
  },
  caseBatteryPercent: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  batteryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 10,
  },
  leftBattery: {
    color: 'red',
    fontSize: 14,
  },
  rightBattery: {
    color: 'orange',
    fontSize: 14,
  },
  optionBox: {
    backgroundColor: '#1C1B22',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
  },
  optionLabel: {
    fontSize: 16,
    color: '#fff',
  },
  soundEffectBox: {
    backgroundColor: '#1C1B22',
    borderRadius: 12,
    padding: 16,
    marginBottom: 70,
  },
  soundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  customize: {
    color: '#ccc',
    fontSize: 14,
  },
  soundOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  soundBtn: {
    backgroundColor: '#111',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  soundBtnActive: {
    backgroundColor: '#fff',
  },
  soundText: {
    color: '#ccc',
  },
  soundTextActive: {
    color: '#000',
    fontWeight: '600',
  },
  sliderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderBox: {
    flex: 1,
    backgroundColor: '#1C1B22',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 5,
  },
  slider: {
    marginTop: 10,
  },
  syncBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  syncBtnText: {
    color: '#000',
    fontWeight: '600',
  },
});
