import DeviceDetail from '@/screens/DeviceDetail';
import Ionicons from '@react-native-vector-icons/ionicons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { useWindowDimensions } from 'react-native';
import HealthDetail from '@/screens/DeviceDetail/HealthDetail';
import WorkOutDetail from '@/screens/DeviceDetail/WorkOutDetail';
import { Colors } from '@/theme/colors';
import DetailSettingStack from '../DetailSettingStack';
import { HomeStackParamList } from '../HomeStack/HomeStack';

type DetailTabParamList = {
  Health: {
    id: string;
    name: string | null;
  };

  Gallery: {
    id: string;
    name: string | null;
  };

  WorkOut: {
    id: string;
    name: string | null;
  };
  Setting: undefined;
};

type Props = NativeStackScreenProps<HomeStackParamList, 'DeviceDetailTab'>;

const Tab = createBottomTabNavigator<DetailTabParamList>();

const DetailsTab = ({ route }: Props) => {
  const { id, name } = route.params;
  // const { width } = useWindowDimensions();
  // const TAB_WIDTH = width * 0.85;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.white,

        tabBarShowLabel: true,

        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          marginBottom: 8,
        },

        tabBarIconStyle: {
          // marginTop: 10,
        },

        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          marginHorizontal: 24,
          alignItems: 'center',
          height: 55,
          borderRadius: 40,
          backgroundColor: '#262626',
          borderTopWidth: 0,
          elevation: 0,
          overflow: 'hidden',
        },

        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },

        // tabBarBackground: () => (
        //   <Image
        //     source={require('../../../assets/images/footerbarImg.png')}
        //     style={{
        //       width: '100%',
        //       height: '100%',
        //       borderRadius: 45,
        //     }}
        //     resizeMode="cover"
        //   />
        // ),
      }}
    >
      <Tab.Screen
        name="Health"
        component={HealthDetail}
        initialParams={{ id, name }}
        options={{
          tabBarLabel: 'Health',

          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'heart' : 'heart-outline'}
              size={30}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Gallery"
        component={DeviceDetail}
        initialParams={{ id, name }}
        options={{
          tabBarLabel: 'Gallery',

          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'images' : 'images-outline'}
              size={30}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="WorkOut"
        component={WorkOutDetail}
        initialParams={{ id, name }}
        options={{
          tabBarLabel: 'Workout',

          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'walk' : 'walk-outline'}
              size={30}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Setting"
        component={DetailSettingStack}
        // initialParams={{ id, name }}
        options={{
          tabBarLabel: 'Setting',

          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'settings' : 'settings-outline'}
              size={30}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default DetailsTab;
