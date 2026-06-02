import CustomPageHeader from '@/components/elements/common/CustomPageHeader';
import WheelPicker from '@/components/elements/Profile/CustomWheelPicker';
import { ProfileStackParamList } from '@/components/navigation/ProfileStack';
import {
  addStepLength,
  getLatestStepLength,
} from '@/storage/service/stepLength.service';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const StepLengthTemplate = () => {
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();
  const latest = getLatestStepLength();
  const [stepLength, setStepLength] = useState<string>(latest?.value || '60.0');
  const stepLengths = Array.from(
    { length: 1500 },
    (_, i) => `${(20 + i * 0.1).toFixed(1)}`,
  );
  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
      <CustomPageHeader
        name="Step Length"
        onBack={() => {
          addStepLength(stepLength);
          navigation.goBack();
        }}
      />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <WheelPicker
          data={stepLengths}
          value={stepLength}
          unit="CM"
          onChange={setStepLength}
        />
      </View>
    </SafeAreaView>
  );
};

export default StepLengthTemplate;
