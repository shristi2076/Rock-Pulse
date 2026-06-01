import CustomPageHeader from '@/components/elements/common/CustomPageHeader';
import WheelPicker from '@/components/elements/Profile/CustomWheelPicker';
import { ProfileStackParamList } from '@/components/navigation/ProfileStack';
import { addWeight, getLatestWeight } from '@/storage/service/weight.service';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const WeightTemplate = () => {
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();
  const latest = getLatestWeight();
  console.log('🚀 ~ WeightTemplate ~ latest:', latest);
  const [weight, setWeight] = useState<string>(latest?.value || '60.0');
  console.log('🚀 ~ WeightTemplate ~ weight:', weight);
  const weights = Array.from(
    { length: 3000 },
    (_, i) => `${(40 + i * 0.1).toFixed(1)}`,
  );
  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
      <CustomPageHeader
        name="Weight"
        onBack={() => {
          addWeight(weight);
          navigation.goBack();
        }}
      />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <WheelPicker
          data={weights}
          value={weight}
          unit="KG"
          onChange={setWeight}
        />
      </View>
    </SafeAreaView>
  );
};

export default WeightTemplate;
