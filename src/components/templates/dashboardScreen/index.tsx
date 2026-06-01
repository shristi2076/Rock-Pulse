/* eslint-disable react-native/no-inline-styles */
import { globalStyles } from '@/styles/global';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// import SettingSvg from '@/assets/images/setting.svg';
import CustomButton from '@/components/elements/common/CustomButton';
import DeviceIcon from '@/components/elements/common/CustomIcons';
import CustomNotification from '@/components/elements/common/CustomNotification';
import { HomeStackParamList } from '@/components/navigation/HomeStack/HomeStack';
import LinearGradient from 'react-native-linear-gradient';
import { useBle } from 'src/context/BleContext';
// import { SearchBar } from 'react-native-screens';

type OnboardingScreenNavProp = StackNavigationProp<
  HomeStackParamList,
  'Dashboard'
>;

const DashboardPage = () => {
  const {
    manager,
    connectedDevices,
    savedDevices,
    disconnectDevice,
    reconnectDeviceById,
    removeDevice,
    connectingId,
  } = useBle();

  const [msgObj, setMsgObj] = React.useState<{
    message: string | null;
    success: boolean;
    duration?: number;
  }>({
    message: null,
    success: false,
    duration: 3000,
  });

  // const connectedDevicesList = Array.from(connectedDevices.values());
  console.log('🚀 ~ DashboardPage ~ connectedDevicesList:', savedDevices);

  const navigation = useNavigation<OnboardingScreenNavProp>();

  const navToDetail = (id: string, name: string | null) => {
    navigation.navigate('DeviceDetailTab', {
      id,
      name,
    });
  };

  useEffect(() => {
    loadAndReconnectDevices();
  }, []);

  const loadAndReconnectDevices = async () => {
    try {
      const realDevices = await manager.connectedDevices([]);
      console.log(
        '📡 Real connected:',
        realDevices.map(d => d.id),
      );
    } catch (error) {
      console.error('Error loading saved devices:', error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headertitle}>
            <Text style={styles.title}>
              Hi, Rockstars <Text style={styles.emoji}>👑</Text>
            </Text>
            <Text style={styles.subtitle}>Explore the world with us.</Text>
          </View>
          <Image
            source={require('../../../assets/images/rocklogo.png')}
            alt="svg image"
            width={100}
            height={30}
          />
        </View>

        {/* Search Card */}
        {/* <View style={styles.searchCard}>
          <Text style={styles.cardTitle}>Search your device</Text>
          <SettingSvg width={width * 0.05} height={width * 0.05} />
        </View> */}
        {/* <TextInput placeholder="Search" style={{ backgroundColor: 'white' }} /> */}
        {/* Big Example Card */}
        {/* <View style={styles.card}>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Headphone</Text>
            <Text style={styles.cardSubtitle}>Vibe</Text>
          </View>
          <DeviceIcon name="move" size={100} />
        </View> */}
        {/* Grid of Half Cards */}
        <FlatList
          data={savedDevices}
          keyExtractor={item => item.id}
          // progressViewOffset={5}
          renderItem={({ item }) => {
            // const Icon = item.icon;
            const isConnected = connectedDevices.has(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() =>
                  isConnected
                    ? navToDetail(item.id, item.name)
                    : setMsgObj({
                        message: `Connect your device ${item.id}`,
                        success: false,
                        duration: 5000,
                      })
                }
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#140e17', '#262427', '#140e17']}
                  start={{ x: 0, y: 0.5 }} // LEFT
                  end={{ x: 1, y: 0.5 }} // RIGHT
                  style={(globalStyles.gradient, styles.card)}
                >
                  <View
                    style={{
                      height: 120,
                      justifyContent: 'space-between',
                    }}
                  >
                    <View>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      <Text
                        style={[
                          styles.cardConnected,
                          { color: isConnected ? '#20d35b' : '#9ca3af' },
                        ]}
                      >
                        {isConnected ? 'Connected' : 'Disconnected'}
                      </Text>
                      <Text style={styles.cardSubtitle}>{item.id}</Text>
                    </View>

                    <View style={{ marginTop: 4 }}>
                      <CustomButton
                        title={isConnected ? 'Remove Device' : 'Connect Device'}
                        loading={connectingId === item.id}
                        disabled={connectingId === item.id}
                        variant={!isConnected ? 'primary' : 'secondary'}
                        onPress={() =>
                          isConnected
                            ? disconnectDevice(item.id)
                            : reconnectDeviceById(item.id)
                        }
                      />
                      <CustomButton
                        title="Disconnect"
                        loading={connectingId === item.id}
                        disabled={connectingId === item.id}
                        variant="secondary"
                        onPress={async () => {
                          await removeDevice(item.id);
                        }}
                      />
                    </View>
                  </View>
                  <View style={styles.iconWrapper}>
                    <DeviceIcon name={item.name} size={130} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <Text
              style={{
                // backgroundColor: 'blue',
                color: 'white',
                textAlign: 'center',
                fontSize: 16,
              }}
            >
              No Connected Devices available
            </Text>
          }
          contentContainerStyle={
            {
              // paddingBottom: 20,
              // backgroundColor: 'red'
            }
          }
        />
        {/* Bottom Indicator */}
        {/* <View style={styles.homeIndicator} /> */}
        {msgObj.message && (
          <CustomNotification
            message={msgObj.message}
            isSuccess={msgObj.success}
          />
        )}
      </View>
    </>
  );
};

export default DashboardPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#140e17', // bg-gray-900
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    marginVertical: 16, // top & bottom = 16
    marginHorizontal: 0, // left & right = 0
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headertitle: {
    flexDirection: 'column',
  },

  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  emoji: {
    color: '#facc15', // yellow
  },
  subtitle: {
    color: '#9ca3af', // gray-400
    fontSize: 14,
    marginTop: 4,
  },
  searchCard: {
    width: '100%',
    backgroundColor: '#140e17',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#8C8C8C',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#3e3e43',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTextContainer: {
    justifyContent: 'flex-start',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  cardSubtitle: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 4,
  },
  cardConnected: {
    color: '#20d35b',
    fontSize: 14,
    marginTop: 4,
  },
  homeIndicator: {
    height: 5,
    backgroundColor: '#333',
    borderRadius: 3,
    marginHorizontal: 50,
    marginTop: 'auto',
    marginBottom: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfCard: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: '#363536',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#374151',
    justifyContent: 'space-between',
  },
  iconWrapper: {
    alignItems: 'flex-end',
    marginTop: 'auto', // push SVG to bottom
  },
});
