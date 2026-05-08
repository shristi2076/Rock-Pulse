import { Buffer } from 'buffer';
import { Device } from 'react-native-ble-plx';

//  Standard UUIDs
const BATTERY_SERVICE = '0000180f-0000-1000-8000-00805f9b34fb';
const BATTERY_CHAR = '00002a19-0000-1000-8000-00805f9b34fb';

const HEART_RATE_SERVICE = '0000180d-0000-1000-8000-00805f9b34fb';
const HEART_RATE_CHAR = '00002a37-0000-1000-8000-00805f9b34fb';

const STEPS_SERVICE1 = '0000fee7-0000-1000-8000-00805f9b34fb';
const STEPS_CHAR1 = '0000fea1-0000-1000-8000-00805f9b34fb';
const STEPS_SERVICE = '0000feea-0000-1000-8000-00805f9b34fb';
const STEPS_CHAR = '0000fee1-0000-1000-8000-00805f9b34fb';

const BLOOD_PRESSURE_RATE_SERVICE = '0000feea-0000-1000-8000-00805f9b34fb';
const BLOOD_PRESSURE_RATE_CHAR = '0000fee3-0000-1000-8000-00805f9b34fb';

const parseU16 = (data: Buffer, offset: number) =>
  (data[offset + 1] << 8) | data[offset];

const parseU24 = (data: Buffer, offset: number) =>
  data[offset] | (data[offset + 1] << 8) | (data[offset + 2] << 16);

//  Battery
export const getBatteryLevel = async (
  device: Device,
): Promise<number | null> => {
  try {
    const char = await device.readCharacteristicForService(
      BATTERY_SERVICE,
      BATTERY_CHAR,
    );

    if (!char.value) return null;

    const decoded = Buffer.from(char.value, 'base64');
    return decoded[0];
  } catch (error) {
    console.error('Battery read error:', error);
    return null;
  }
};

export const monitorBatteryLevel = async (
  device: Device,
  onUpdate: (steps: number) => void,
) => {
  try {
    return device.monitorCharacteristicForService(
      BATTERY_SERVICE,
      BATTERY_CHAR,
      (error, char) => {
        if (error || !char?.value) return null;

        const decoded = Buffer.from(char.value, 'base64');
        onUpdate(decoded[0]);
      },
    );
  } catch (error) {
    console.error('Battery read error:', error);
    return null;
  }
};

//  Heart Rate
export const monitorHeartRate = (
  device: Device,
  callback: (hr: number) => void,
) => {
  return device.monitorCharacteristicForService(
    HEART_RATE_SERVICE,
    HEART_RATE_CHAR,
    (error, char) => {
      if (error) {
        console.error('HR monitor error:', error);
        return;
      }

      if (!char?.value) return;

      const decoded = Buffer.from(char.value, 'base64');

      // First byte = flags
      const flags = decoded[0];

      let heartRate;

      if (flags & 0x01) {
        // 16-bit HR
        heartRate = decoded.readUInt16LE(1);
      } else {
        // 8-bit HR
        heartRate = decoded[1];
      }

      callback(heartRate);
    },
  );
};

export const monitoringHeartRate = (
  device: Device,
  onUpdate: (hr: number) => void,
) => {
  return device.monitorCharacteristicForService(
    '180D',
    '2A37',
    (error, char) => {
      if (error || !char?.value) {
        console.log('HR error:', error);
        return;
      }

      const decoded = Buffer.from(char.value, 'base64');

      const flags = decoded[0];
      const is16Bit = flags & 0x01;

      let heartRate;

      if (is16Bit) {
        heartRate = decoded[1] | (decoded[2] << 8);
      } else {
        heartRate = decoded[1];
      }

      onUpdate(heartRate);
    },
  );
};

export const getCurrentSteps = async (device: Device) => {
  const char = await device.readCharacteristicForService(
    STEPS_SERVICE,
    STEPS_CHAR,
  );

  if (!char.value) return null;

  const data = Buffer.from(char.value, 'base64');

  let steps: number;
  let calories: number;
  let distanceKm: number;

  //  Detect format
  if (data.length >= 9) {
    //  FEE1 style (uint24)
    steps = parseU24(data, 0);
    distanceKm = parseU24(data, 3) / 1000;
    calories = parseU24(data, 6);
  } else {
    // ⚡ realtime style (uint16)
    steps = parseU16(data, 0);
    calories = parseU16(data, 2);
    distanceKm = parseU16(data, 4) / 1000;
  }

  return { steps, calories, distanceKm };
};
export const monitorSteps = (
  device: Device,
  onUpdate: (data: {
    steps: number;
    calories: number;
    distanceKm: number;
  }) => void,
) => {
  return device.monitorCharacteristicForService(
    STEPS_SERVICE1,
    STEPS_CHAR1,
    (error, char) => {
      if (error || !char?.value) return;

      const data = Buffer.from(char.value, 'base64');

      let steps: number;
      let calories: number;
      let distanceKm: number;

      // same logic
      if (data.length >= 9) {
        steps = parseU24(data, 0);
        distanceKm = parseU24(data, 3) / 1000;
        calories = parseU24(data, 6);
      } else {
        steps = parseU16(data, 0);
        calories = parseU16(data, 2);
        distanceKm = parseU16(data, 4) / 1000;
      }

      onUpdate({ steps, calories, distanceKm });
    },
  );
};

export const getMonitorBloodPressure = (
  device: Device,
  onUpdate: (data: { systolic: number; diastolic: number }) => void,
) => {
  return device.monitorCharacteristicForService(
    BLOOD_PRESSURE_RATE_SERVICE,
    BLOOD_PRESSURE_RATE_CHAR,
    (error, char) => {
      if (error) {
        console.log(' BP Monitor Error:', error);
        return;
      }

      if (!char?.value) return;

      const decoded = Buffer.from(char.value, 'base64');

      //  ensure enough bytes exist
      if (decoded.length < 8) return;

      //  correct mapping
      const systolic = decoded[6];
      const diastolic = decoded[7];

      onUpdate({
        systolic,
        diastolic,
      });
    },
  );
};

export const getCurrentBloodPressure = async (
  device: Device,
): Promise<number | null> => {
  try {
    const char = await device.readCharacteristicForService(
      BLOOD_PRESSURE_RATE_SERVICE,
      BLOOD_PRESSURE_RATE_CHAR,
    );

    if (!char.value) return null;

    const decoded = Buffer.from(char.value, 'base64');
    console.log('🚀 ~ getBatteryLevel ~ decoded:', decoded);
    return decoded[0];
  } catch (error) {
    console.error('Battery read error:', error);
    return null;
  }
};
