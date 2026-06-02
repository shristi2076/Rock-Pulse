import CustomPageHeader from '@/components/elements/common/CustomPageHeader';
import WheelPicker from '@/components/elements/Profile/CustomWheelPicker';
import { ProfileStackParamList } from '@/components/navigation/ProfileStack';
import { addHeight, getLatestHeight } from '@/storage/service/height.service';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HeightTemplate = () => {
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();
  const latest = getLatestHeight();
  const [height, setHeight] = useState<string>(latest?.value || '160.0');
  const heights = Array.from(
    { length: 1000 },
    (_, i) => `${(150 + i * 0.1).toFixed(1)}`,
  );
  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
      <CustomPageHeader
        name="Height"
        onBack={() => {
          addHeight(height);
          navigation.goBack();
        }}
      />
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <WheelPicker
          data={heights}
          value={height}
          unit="CM"
          onChange={setHeight}
        />
      </View>
    </SafeAreaView>
  );
};

export default HeightTemplate;
