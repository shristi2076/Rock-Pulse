import CustomPageHeader from '@/components/elements/common/CustomPageHeader';
import WheelPicker from '@/components/elements/Profile/CustomWheelPicker';
import { ProfileStackParamList } from '@/components/navigation/ProfileStack';
import {
  addStepGoal,
  getLatestStepGoal,
} from '@/storage/service/stepGoal.service';

import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const StepGoalTemplate = () => {
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();
  const latest = getLatestStepGoal();

  if (!latest) {
    addStepGoal('8000');
  }
  const [stepGoal, setStepGoal] = useState<string>(latest?.value || '8000');
  const stepGoals = Array.from({ length: 50 }, (_, i) => `${1000 + i * 1000}`);
  return (
    <SafeAreaView style={styles.container}>
      <CustomPageHeader
        name="Step Goal"
        onBack={() => {
          addStepGoal(stepGoal);
          navigation.goBack();
        }}
      />
      <View style={styles.listContainer}>
        <WheelPicker data={stepGoals} value={stepGoal} onChange={setStepGoal} />
      </View>
    </SafeAreaView>
  );
};

export default StepGoalTemplate;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0715',
    paddingHorizontal: 16,
  },
  listContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
