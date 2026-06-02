import CustomPageHeader from '@/components/elements/common/CustomPageHeader';
import WheelPicker from '@/components/elements/Profile/CustomWheelPicker';
import { ProfileStackParamList } from '@/components/navigation/ProfileStack';
import { getGender, saveGender } from '@/storage/service/gender.service';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GenderTemplate = () => {
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();

  const [gender, setGender] = useState(getGender() || 'Male');

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
      <CustomPageHeader
        name="Gender"
        onBack={() => {
          saveGender(gender);
          navigation.goBack();
        }}
      />

      <View style={{ flex: 1, justifyContent: 'center' }}>
        <WheelPicker
          data={['Male', 'Female']}
          value={gender}
          onChange={setGender}
        />
      </View>
    </SafeAreaView>
  );
};

export default GenderTemplate;
