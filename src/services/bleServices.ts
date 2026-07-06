import { Buffer } from 'buffer';
import { Device } from 'react-native-ble-plx';

//  Standard UUIDs
const BATTERY_SERVICE = '0000180f-0000-1000-8000-00805f9b34fb';
const BATTERY_CHAR = '00002a19-0000-1000-8000-00805f9b34fb';

const HEART_RATE_SERVICE = '0000180d-0000-1000-8000-00805f9b34fb';
const HEART_RATE_CHAR = '00002a37-0000-1000-8000-00805f9b34fb';

const STEPS_SERVICE1 = '0000fee7-0000-1000-8000-00805f9b34fb';
const STEPS_CHAR1 = '0000fea1-0000-1000-8000-00805f9b34fb';
// const HEALTH_SERVICE = '0000feea-0000-1000-8000-00805f9b34fb';
const STEPS_CHAR = '0000fee1-0000-1000-8000-00805f9b34fb';

// const HEALTH_SERVICE = '0000feea-0000-1000-8000-00805f9b34fb';
// const HEALTH_NOTIFY_CHAR = '0000fee3-0000-1000-8000-00805f9b34fb';

// const HEALTH_SERVICE = '0000feea-0000-1000-8000-00805f9b34fb';
// const HEALTH_WRITE_CHAR = '0000fee2-0000-1000-8000-00805f9b34fb';
// const HEALTH_NOTIFY_CHAR = '0000fee3-0000-1000-8000-00805f9b34fb';
// const HEALTH_READ_CHAR = '0000fee4-0000-1000-8000-00805f9b34fb';
// ===================== COMMANDS =====================
const CMD_SPO2_START = 'feea20066b00';
const CMD_SPO2_STOP = 'feea20066bff';

const HEALTH_SERVICE = '0000feea-0000-1000-8000-00805f9b34fb';

const HEALTH_NOTIFY_CHAR = '0000fee3-0000-1000-8000-00805f9b34fb';
const HEALTH_WRITE_CHAR = '0000fee2-0000-1000-8000-00805f9b34fb';
const HEALTH_READ_CHAR = '0000fee4-0000-1000-8000-00805f9b34fb';

const parseU16 = (data: Buffer, offset: number) =>
  (data[offset + 1] << 8) | data[offset];

const parseU24 = (data: Buffer, offset: number) =>
  data[offset] | (data[offset + 1] << 8) | (data[offset + 2] << 16);

function hexToBase64(hex: any) {
  return Buffer.from(hex, 'hex').toString('base64');
}

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
    HEALTH_SERVICE,
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
    HEALTH_SERVICE,
    STEPS_CHAR,
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
    HEALTH_SERVICE,
    HEALTH_NOTIFY_CHAR,
    (error, char) => {
      if (error) {
        console.log(' BP Monitor Error:', error);
        return;
      }

      if (!char?.value) return;

      const decoded = Buffer.from(char.value, 'base64');
      const hex = decoded.toString('hex');
      const header = hex.slice(0, 10);
      //  ensure enough bytes exist
      if (decoded.length < 8) return;

      //  correct mapping
      const systolic = decoded[6];
      const diastolic = decoded[7];
      if (header === 'feea200869') {
        onUpdate({
          systolic,
          diastolic,
        });
      }
    },
  );
};

export const getCurrentBloodPressure = async (
  device: Device,
): Promise<number | null> => {
  try {
    const char = await device.readCharacteristicForService(
      HEALTH_SERVICE,
      HEALTH_NOTIFY_CHAR,
    );

    if (!char.value) return null;

    const decoded = Buffer.from(char.value, 'base64');
    // console.log('🚀 ~ getBatteryLevel ~ decoded:', decoded);
    return decoded[0];
  } catch (error) {
    console.error('Battery read error:', error);
    return null;
  }
};

//blood oxygen
export const getCurrentSpO2 = async (
  device: Device,
): Promise<number | null> => {
  try {
    const char = await device.readCharacteristicForService(
      HEALTH_SERVICE,
      HEALTH_READ_CHAR,
    );
    // console.log('🚀 ~ getCurrentSpO2 ~ char:', char);

    if (!char?.value) return null;

    const decoded = Buffer.from(char.value, 'base64');

    return decoded[decoded.length - 1];
  } catch (error) {
    console.error('SpO2 read error:', error);
    return null;
  }
};

export const getMonitorSpO2 = (
  device: Device,
  onUpdate: (spo2: number) => void,
) => {
  return device.monitorCharacteristicForService(
    HEALTH_SERVICE,
    HEALTH_NOTIFY_CHAR,
    (error, char) => {
      if (error) {
        console.log('SpO2 Monitor Error:', error);
        return;
      }

      if (!char?.value) return;
      // console.log('🚀 ~ getMonitorSpO2 ~ char?.value:', char?.value);

      const decoded = Buffer.from(char.value, 'base64');
      const hex = decoded.toString('hex');

      const header = hex.slice(0, 10);
      const spo2 = decoded[decoded.length - 1];

      if (header === 'feea20066b' && spo2 > 0 && spo2 <= 100) {
        onUpdate(spo2);
      }
    },
  );
};

export const initiateSpO2Measurement = async (device: Device) => {
  try {
    // console.log('initiateSpO2Measurement');
    await device.writeCharacteristicWithoutResponseForService(
      HEALTH_SERVICE,
      HEALTH_WRITE_CHAR,
      hexToBase64(CMD_SPO2_START),
    );

    return true;
  } catch (error) {
    console.error('SpO2 start error:', error);
    return false;
  }
};

export const stopSpO2Measurement = async (device: Device) => {
  try {
    await device.writeCharacteristicWithoutResponseForService(
      HEALTH_WRITE_CHAR,
      HEALTH_WRITE_CHAR,
      hexToBase64(CMD_SPO2_STOP),
    );

    return true;
  } catch (error) {
    console.error('SpO2 stop error:', error);
    return false;
  }
};

const CMD_STRESS_START = 'feea2008b9010000';
const CMD_STRESS_STOP = 'feea2008b90100ff';

export const initiateStressMeasurement = async (device: Device) => {
  try {
    // console.log('initiateSpO2Measurement');
    await device.writeCharacteristicWithoutResponseForService(
      HEALTH_SERVICE,
      HEALTH_WRITE_CHAR,
      hexToBase64(CMD_STRESS_START),
    );

    return true;
  } catch (error) {
    console.error('Stress monitor start error:', error);
    return false;
  }
};

export const stopStressMeasurement = async (device: Device) => {
  try {
    await device.writeCharacteristicWithoutResponseForService(
      HEALTH_WRITE_CHAR,
      HEALTH_WRITE_CHAR,
      hexToBase64(CMD_STRESS_STOP),
    );

    return true;
  } catch (error) {
    console.error('Stress monitor stop error:', error);
    return false;
  }
};

export const getMonitorStress = (
  device: Device,
  onUpdate: (stress: number) => void,
) => {
  return device.monitorCharacteristicForService(
    HEALTH_SERVICE,
    HEALTH_NOTIFY_CHAR,
    (error, char) => {
      if (error) {
        console.log('Stress Monitor Error:', error);
        return;
      }

      if (!char?.value) return;
      // console.log('🚀 ~ getMonitorStress ~ char?.value:', char?.value);

      const decoded = Buffer.from(char.value, 'base64');
      const hex = decoded.toString('hex');

      const header = hex.slice(0, 10);
      const stress = decoded[decoded.length - 1];

      if (header === 'feea2008b9' && stress > 0 && stress <= 100) {
        onUpdate(stress);
      }
    },
  );
};
