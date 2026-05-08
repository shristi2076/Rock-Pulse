import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BleManager, Device } from 'react-native-ble-plx';
import CustomNotification from '@/components/elements/CustomNotification';

const STORAGE_KEY = '@connected_device_ids';

type BleContextType = {
  manager: BleManager;
  connectedDevices: Map<string, Device>;
  connectingId: string | null;
  getSavedDeviceIds: () => Promise<string[]>;
  connectDevice: (device: Device) => Promise<void>;
  reconnectSavedDevices: (device: Device) => Promise<void>;
  reconnectDeviceById: (id: string) => Promise<void>;
  disconnectDevice: (id: string) => Promise<void>;
};

const BleContext = createContext<BleContextType | null>(null);

export const BleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [manager] = useState(() => new BleManager());
  const [connectedDevices, setConnectedDevices] = useState<Map<string, Device>>(
    new Map(),
  );
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

  // Save IDs only
  type SavedDevice = {
    id: string;
    name: string | null;
  };
  const saveDeviceIds = async (devices: Map<string, Device>) => {
    try {
      const existing = await AsyncStorage.getItem(STORAGE_KEY);
      let existingList: SavedDevice[] = existing ? JSON.parse(existing) : [];

      const newList: SavedDevice[] = Array.from(devices.values()).map(d => ({
        id: d.id,
        name: d.name ?? null,
      }));

      //  merge + remove duplicates
      const merged = [...existingList];

      newList.forEach(newDevice => {
        const index = merged.findIndex(d => d.id === newDevice.id);
        if (index !== -1) {
          merged[index] = newDevice;
        } else {
          merged.push(newDevice);
        }
      });

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch (e) {
      console.log(' Save error:', e);
    }
  };

  const getSavedDeviceIds = async (): Promise<string[]> => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      return JSON.parse(stored);
    } catch (e) {
      console.log(' Failed to get saved device IDs', e);
      return [];
    }
  };

  //  Connect
  const connectDevice = async (device: Device) => {
    try {
      console.log(' Connecting:', device.id);

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

      console.log(' Connected:', device.id);
    } catch (e) {
      console.log(' Connect error:', e);
    }
  };

  //  Disconnect
  const disconnectDevice = async (id: string) => {
    try {
      console.log(' Disconnecting:', id);

      const isConnected = await manager.isDeviceConnected(id);

      if (isConnected) {
        await manager.cancelDeviceConnection(id);
      }
      setMsgObj({
        message: `${id} disconnected successfully`,
        success: false,
        duration: 5000,
      });
      // ALWAYS remove from UI (whether connected or not)
      setConnectedDevices(prev => {
        const updated = new Map(prev);
        updated.delete(id);
        saveDeviceIds(updated);
        return updated;
      });
    } catch (e) {
      console.log(' Disconnect error:', e);
    }
  };

  //  Auto reconnect on app start
  const reconnectSavedDevices = async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const ids: string[] = JSON.parse(stored);
    if (ids.length === 0) return;

    console.log(' Manually reconnecting:', ids);

    for (const id of ids) {
      try {
        const device = await manager.connectToDevice(id, {
          timeout: 10000,
        });

        await device.discoverAllServicesAndCharacteristics();

        setConnectedDevices(prev => {
          const updated = new Map(prev);
          updated.set(id, device);
          return updated;
        });

        console.log(' Reconnected:', id);
      } catch (e) {
        console.log(' Failed to reconnect:', id, e);
      }
    }
  };

  const reconnectDeviceById = async (id: string): Promise<void> => {
    setConnectingId(id);

    try {
      console.log(' connecting:', id);

      try {
        await manager.cancelDeviceConnection(id);
      } catch (e: any) {
        console.log('error disconnecting', e);
      }

      await new Promise<void>(res => setTimeout(res, 500));

      const device = await manager.connectToDevice(id, {
        timeout: 15000,
      });

      await device.discoverAllServicesAndCharacteristics();
      setMsgObj({
        message: `${id} connected successfully`,
        success: true,
        duration: 5000,
      });
      setConnectedDevices(prev => {
        const updated = new Map(prev);
        updated.set(id, device);

        return updated;
      });

      console.log('connected:', id);
    } catch (e: any) {
      console.log('connect failed:', e);
      // Set the message to show the UI
      setMsgObj({
        message: e.message || 'Failed to connect',
        success: false,
        duration: 5000,
      });
    } finally {
      setConnectingId(null);
    }
  };

  return (
    <BleContext.Provider
      value={{
        manager,
        connectedDevices,
        getSavedDeviceIds,
        connectDevice,
        reconnectSavedDevices,
        reconnectDeviceById,
        disconnectDevice,
        connectingId,
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

export const useBle = () => {
  const ctx = useContext(BleContext);
  if (!ctx) throw new Error('useBle must be used inside BleProvider');
  return ctx;
};
