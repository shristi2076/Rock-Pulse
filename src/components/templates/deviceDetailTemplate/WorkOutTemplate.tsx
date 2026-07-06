/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import {
  InteractionManager,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import WorkOut from '@/components/elements/common/WorkOutItem';
import { HomeStackParamList } from '@/components/navigation/HomeStack/HomeStack';
import Ionicons from '@react-native-vector-icons/ionicons';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBle } from 'src/context/BleContext';
import {
  getCurrentSpO2,
  getMonitorBloodPressure,
  getMonitorSpO2,
  getMonitorStress,
  initiateSpO2Measurement,
  monitoringHeartRate,
} from 'src/services/bleServices';
import { Colors } from '@/theme/colors';

type DeviceDetailRouteProp = RouteProp<HomeStackParamList, 'DeviceDetailTab'>;

const WorkOutTemplate = ({ route }: { route: DeviceDetailRouteProp }) => {
  const { id, name } = route.params;
  const hrSubscription = useRef<any>(null);
  const bPSubscription = useRef<any>(null);
  const oxygenSubscription = useRef<any>(null);
  const stressSubscription = useRef<any>(null);

  const navigation = useNavigation();
  const { connectedDevices } = useBle();

  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [bPData, setBPData] = useState<{
    systolic: number;
    diastolic: number;
  } | null>(null);
  const [oxygenLevel, setOxygenLevel] = useState<number | null>(null);
  const [stressLevel, setStressLevel] = useState<number | null>(null);

  const onBack = () => navigation.goBack();

  useEffect(() => {
    let interactionTask: any;

    const fetchBatteryAndHR = async () => {
      const device = connectedDevices.get(id);

      if (!device) {
        // setLoadingBattery(false);
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

        // Heart Rate
        hrSubscription.current = monitoringHeartRate(device, hr => {
          setHeartRate(hr);
        });

        // Blood Pressure
        bPSubscription.current = await getMonitorBloodPressure(device, bp => {
          setBPData(bp);
        });

        //Blood Oxygen Saturation
        // await initiateSpO2Measurement(device); // initiates bloodoxygen
        // const currentOxygen = await getCurrentSpO2(device);
        // console.log('🚀 ~ fetchBatteryAndHR ~ currentOxygen:', currentOxygen);
        // setOxygenLevel(currentOxygen);

        oxygenSubscription.current = await getMonitorSpO2(
          device,
          oxygenRate => {
            console.log('🚀  ox:', oxygenRate);
            setOxygenLevel(oxygenRate);
          },
        );

        //Stress
        stressSubscription.current = await getMonitorStress(device, stress => {
          console.log('🚀  stress:', stress);
          setStressLevel(stress);
        });
      } catch (err) {
        console.log('Error:', err);
      } finally {
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
        hrSubscription.current &&
        typeof hrSubscription.current.remove === 'function'
      ) {
        hrSubscription.current.remove();
      }

      if (
        bPSubscription.current &&
        typeof bPSubscription.current.remove === 'function'
      ) {
        bPSubscription.current.remove();
      }

      if (
        oxygenSubscription.current &&
        typeof oxygenSubscription.current.remove === 'function'
      ) {
        oxygenSubscription.current.remove();
      }
      if (
        stressSubscription.current &&
        typeof stressSubscription.current.remove === 'function'
      ) {
        stressSubscription.current.remove();
      }
    };
  }, [connectedDevices, id]);

  const getProgress = (value: number, min: number, max: number) => {
    return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  };

  const getBloodPressureProgress = (sys?: string, dia?: string) => {
    const systolic = Number(sys);
    const diastolic = Number(dia);

    if (isNaN(systolic) || isNaN(diastolic)) {
      return 0;
    }

    const sysScore = ((systolic - 70) / (180 - 70)) * 100;

    const diaScore = ((diastolic - 40) / (120 - 40)) * 100;

    return Math.max(0, Math.min(100, (sysScore + diaScore) / 2));
  };
  //progress
  const hrProgress = heartRate !== null ? getProgress(heartRate, 40, 200) : 0;
  const spo2Progress =
    oxygenLevel != null ? getProgress(oxygenLevel, 80, 100) : 0;

  const stressProgress =
    stressLevel != null ? getProgress(stressLevel, 0, 100) : 0;
  const bpProgress = getBloodPressureProgress(
    bPData?.systolic?.toString(),
    bPData?.diastolic?.toString(),
  );
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
      <ScrollView
        contentContainerStyle={{
          gap: 20,
          paddingVertical: 20,
        }}
      >
        <WorkOut
          title="Heart Rate"
          value={heartRate || '--'}
          unit="bpm"
          date="10-04-2026 04:57 AM"
          progress={hrProgress}
          labels={['Light', 'Weight', 'Aerobic', 'Anaerobic', 'VO2 Max']}
          gradientColors={[Colors.black, '#9F3232']}
          thumbColor="#FF0000"
        />

        <WorkOut
          title="Blood Pressure"
          value={
            bPData !== null ? `${bPData.systolic}/${bPData.diastolic}` : 'N/A'
          }
          unit="mmHg"
          date="10-04-2026 04:57 AM"
          progress={bpProgress}
          labels={['Low', 'Normal', 'Elevated', 'High']}
          gradientColors={[Colors.black, '#899BFF']}
          thumbColor="#60A5FA"
        />

        <WorkOut
          title="Blood Oxygen"
          value={oxygenLevel || '--'}
          unit="%"
          date="10-04-2026 04:57 AM"
          progress={spo2Progress}
          labels={['Low', 'Normal', 'Good', 'Optimal']}
          gradientColors={[Colors.black, '#70F15C']}
          thumbColor="#36FF17"
        />

        <WorkOut
          title="Stress"
          value={stressLevel || '--'}
          unit="%"
          date="10-04-2026 04:57 AM"
          progress={stressProgress}
          labels={['Relaxed', 'Mild', 'Moderate', 'High']}
          gradientColors={[Colors.black, '#ABE938']}
          thumbColor="#ABE938"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default WorkOutTemplate;

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
    color: Colors.white,
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
    // marginBottom: 20,
  },
  imageBox1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    color: Colors.white,
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
    color: Colors.white,
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
    backgroundColor: Colors.white,
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
    backgroundColor: Colors.white,
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
