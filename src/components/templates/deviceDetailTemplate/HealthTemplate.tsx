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

import MoonCard from '@/components/module/Health/MoonCard';
import StepCounter from '@/components/module/Health/StepCounter';
import { HomeStackParamList } from '@/components/navigation/HomeStack/HomeStack';
import { Colors } from '@/theme/colors';
import Ionicons from '@react-native-vector-icons/ionicons';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBle } from 'src/context/BleContext';
import { getCurrentSteps, monitorSteps } from 'src/services/bleServices';

type DeviceDetailRouteProp = RouteProp<HomeStackParamList, 'DeviceDetailTab'>;

const HealthTemplate = ({ route }: { route: DeviceDetailRouteProp }) => {
  const { id, name } = route.params;
  const stepsSubscription = useRef<any>(null);

  const navigation = useNavigation();
  const { connectedDevices } = useBle();

  const [loadingBattery, setLoadingBattery] = useState(true);
  const [stepsData, setStepsData] = useState<{
    steps: number;
    calories: number;
    distanceKm: number;
  } | null>(null);
  console.log('🚀 ~ HealthTemplate ~ stepsData:', stepsData);

  const onBack = () => navigation.goBack();

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

        // Steps
        const current = await getCurrentSteps(device);

        setStepsData(current);

        stepsSubscription.current = monitorSteps(device, step => {
          // console.log('monitor step ', step);
          setStepsData(step);
        });
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
        stepsSubscription.current &&
        typeof stepsSubscription.current.remove === 'function'
      ) {
        stepsSubscription.current.remove();
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
      <ScrollView
        contentContainerStyle={{
          gap: 20,
          paddingVertical: 20,
        }}
      >
        <StepCounter
          progress={90}
          loading={loadingBattery}
          steps={stepsData?.steps}
          calories={stepsData?.calories}
          distanceKm={stepsData?.distanceKm}
        />
        <MoonCard />
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
