import AddDevicesScreen from '@/screens/AddDevice';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type AddStackParamList = {
  AddDevice: undefined;
};

const Stack = createNativeStackNavigator<AddStackParamList>();

const AddStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AddDevice" component={AddDevicesScreen} />
    </Stack.Navigator>
  );
};

export default AddStack;
