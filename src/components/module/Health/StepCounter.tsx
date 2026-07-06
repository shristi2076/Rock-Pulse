import MetricItem from '@/components/elements/common/MetricItem';
import ProgressRing from '@/components/elements/common/ProgressRing';
import { getAllStepGoals } from '@/storage/service/stepGoal.service';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type Props = {
  steps?: number;
  calories?: number;
  distanceKm?: number;
  loading?: boolean;
  progress?: number;
};

const StepCounter = ({
  steps,
  calories,
  distanceKm,
  loading,
}: //   progress = 90,
Props) => {
  console.log('steps', steps, calories, distanceKm, loading);
  const getStepGoal = getAllStepGoals();
  const stepGoal = Number(getStepGoal[0]?.value);
  return (
    <LinearGradient
      colors={['rgba(201,195,195,0.25)', 'rgba(201,195,195,0)']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <ProgressRing progress={steps || 0} targetSteps={stepGoal || 8000} />

      <View style={styles.metricBox}>
        <MetricItem
          icon="footsteps"
          color="#FFE100"
          label="Steps"
          value={steps ? `${steps} / ${stepGoal}` : 'N/A'}
        />

        <MetricItem
          icon="flame"
          color="#22FF00"
          label="Calories"
          value={loading ? 'Loading...' : `${calories ?? 0} kcal`}
        />

        <MetricItem
          icon="star"
          color="#8503FF"
          label="Distance"
          value={loading ? 'Loading...' : `${distanceKm ?? 0} km`}
        />
      </View>

      {/* <Image
        source={{
          uri: `https://maps.googleapis.com/maps/api/staticmap?center=27.717,85.324&zoom=13&size=600x300&key=YOUR_API_KEY`,
        }}
        style={{ width: '100%', height: 90, borderRadius: 14 }}
      /> */}

      {/* <Image
        source={{
          uri: 'https://maps.googleapis.com/maps/api/staticmap?center=Kathmandu&zoom=12&size=600x300',
        }}
        style={{ width: '100%', height: 90, borderRadius: 14 }}
        resizeMode="cover"
      /> */}
    </LinearGradient>
  );
};

export default StepCounter;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
    backgroundColor: '#000',
    borderRadius: 16,

    shadowColor: '#C9C3C3',
    shadowOffset: {
      width: 6,
      height: -3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 7,

    elevation: 6,
  },
  metricBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 20,
  },
});
