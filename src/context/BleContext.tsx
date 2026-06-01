import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BleManager, Device } from 'react-native-ble-plx';
import CustomNotification from '@/components/elements/common/CustomNotification';

const STORAGE_KEY = '@connected_device_ids';

// ---------------- TYPES ----------------

type SavedDevice = {
  id: string;
  name: string | null;
};

type BleContextType = {
  manager: BleManager;

  connectedDevices: Map<string, Device>;
  savedDevices: SavedDevice[];

  connectingId: string | null;

  connectDevice: (device: Device) => Promise<void>;
  disconnectDevice: (id: string) => Promise<void>;
  removeDevice: (id: string) => Promise<void>;

  reconnectDeviceById: (id: string) => Promise<void>;
  reconnectSavedDevices: () => Promise<void>;
};

const BleContext = createContext<BleContextType | null>(null);

// ---------------- PROVIDER ----------------

export const BleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [manager] = useState(() => new BleManager());

  const [connectedDevices, setConnectedDevices] = useState<Map<string, Device>>(
    new Map(),
  );

  const [savedDevices, setSavedDevices] = useState<SavedDevice[]>([]);

  const [connectingId, setConnectingId] = useState<string | null>(null);

  const [msgObj, setMsgObj] = useState<{
    message: string | null;
    success: boolean;
    duration?: number;
  }>({
    message: null,
    success: false,
    duration: 3000,
  });

  // ---------------- LOAD SAVED ----------------

  const loadSavedDevices = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);

      if (!stored) {
        setSavedDevices([]);
        return;
      }

      setSavedDevices(JSON.parse(stored));
    } catch (e) {
      console.log('Load error:', e);
    }
  };

  useEffect(() => {
    loadSavedDevices();
  }, []);

  // ---------------- SAVE DEVICES ----------------

  const saveDeviceIds = async (devices: Map<string, Device>) => {
    try {
      const list: SavedDevice[] = Array.from(devices.values()).map(d => ({
        id: d.id,
        name: d.name ?? null,
      }));

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      setSavedDevices(list); // 🔥 instant UI update
    } catch (e) {
      console.log('Save error:', e);
    }
  };

  // ---------------- CONNECT ----------------

  const connectDevice = async (device: Device) => {
    try {
      let connected = device;

      const isConnected = await device.isConnected();
      if (!isConnected) {
        connected = await device.connect();
      }

      await connected.discoverAllServicesAndCharacteristics();

      setConnectedDevices(prev => {
        const updated = new Map(prev);
        updated.set(device.id, connected);

        saveDeviceIds(updated);
        return updated;
      });
    } catch (e) {
      console.log('Connect error:', e);
    }
  };

  // ---------------- DISCONNECT ----------------

  const disconnectDevice = async (id: string) => {
    try {
      const isConnected = await manager.isDeviceConnected(id);

      if (isConnected) {
        await manager.cancelDeviceConnection(id);
      }

      setConnectedDevices(prev => {
        const updated = new Map(prev);
        updated.delete(id);

        saveDeviceIds(updated);
        return updated;
      });

      setMsgObj({
        message: 'Device disconnected',
        success: false,
        duration: 3000,
      });
    } catch (e) {
      console.log('Disconnect error:', e);
    }
  };

  // ---------------- REMOVE DEVICE ----------------

  const removeDevice = async (id: string): Promise<void> => {
    try {
      const isConnected = await manager.isDeviceConnected(id);

      if (isConnected) {
        await manager.cancelDeviceConnection(id);
      }

      const filtered = savedDevices.filter(d => d.id !== id);

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

      setSavedDevices(filtered);

      setConnectedDevices(prev => {
        const updated = new Map(prev);
        updated.delete(id);
        return updated;
      });

      setMsgObj({
        message: 'Device removed',
        success: true,
        duration: 3000,
      });
    } catch (e) {
      console.log('Remove error:', e);
    }
  };

  // ---------------- RECONNECT SINGLE ----------------

  const reconnectDeviceById = async (id: string) => {
    setConnectingId(id);

    try {
      try {
        await manager.cancelDeviceConnection(id);
      } catch {}

      await new Promise<void>(res => setTimeout(res, 500));

      const device = await manager.connectToDevice(id, {
        timeout: 15000,
      });

      await device.discoverAllServicesAndCharacteristics();

      setConnectedDevices(prev => {
        const updated = new Map(prev);
        updated.set(id, device);
        return updated;
      });
    } catch (e) {
      console.log('Reconnect error:', e);
    } finally {
      setConnectingId(null);
    }
  };

  // ---------------- RECONNECT ALL ----------------

  const reconnectSavedDevices = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const devices: SavedDevice[] = JSON.parse(stored);

      for (const d of devices) {
        try {
          const device = await manager.connectToDevice(d.id, {
            timeout: 10000,
          });

          await device.discoverAllServicesAndCharacteristics();

          setConnectedDevices(prev => {
            const updated = new Map(prev);
            updated.set(d.id, device);
            return updated;
          });
        } catch (e) {
          console.log('Reconnect failed:', d.id, e);
        }
      }
    } catch (e) {
      console.log('Reconnect all error:', e);
    }
  };

  // ---------------- PROVIDER ----------------

  return (
    <BleContext.Provider
      value={{
        manager,
        connectedDevices,
        savedDevices,
        connectingId,
        connectDevice,
        disconnectDevice,
        removeDevice,
        reconnectDeviceById,
        reconnectSavedDevices,
      }}
    >
      {msgObj.message && (
        <CustomNotification
          message={msgObj.message}
          isSuccess={msgObj.success}
          duration={msgObj.duration}
        />
      )}
      {children}
    </BleContext.Provider>
  );
};

// ---------------- HOOK ----------------

export const useBle = () => {
  const ctx = useContext(BleContext);
  if (!ctx) throw new Error('useBle must be used inside BleProvider');
  return ctx;
};
