import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { locationConfig } from '../constants/config';

export default function useLocationMockable() {
  const [mockEnabled, setMockEnabled] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isInSchool, setIsInSchool] = useState(false);

  const toggleMockLocation = () => setMockEnabled(m => !m);

  useEffect(() => {
    let mounted = true;

    const updateLocation = async () => {
      try {
        if (!mounted) return;
        if (mockEnabled) {
          const mock = {
            coords: {
              latitude: locationConfig.SCHOOL_COORDS.latitude,
              longitude: locationConfig.SCHOOL_COORDS.longitude,
              accuracy: 5,
            }
          };
          setLocation(mock);
          setIsInSchool(true);
          setErrorMsg(null);
          return;
        }

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permissão de localização negada');
          setLocation(null);
          setIsInSchool(false);
          return;
        }

        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        if (!mounted) return;
        setLocation(pos);

        const toRad = (v) => (v * Math.PI) / 180;
        const R = 6371000;
        const dLat = toRad(locationConfig.SCHOOL_COORDS.latitude - pos.coords.latitude);
        const dLon = toRad(locationConfig.SCHOOL_COORDS.longitude - pos.coords.longitude);
        const lat1 = toRad(pos.coords.latitude);
        const lat2 = toRad(locationConfig.SCHOOL_COORDS.latitude);
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.asin(Math.sqrt(a));
        const distance = R * c;
        setIsInSchool(distance <= locationConfig.SCHOOL_RADIUS_METERS);
        setErrorMsg(null);
      } catch (e) {
        setErrorMsg(String(e));
        setLocation(null);
        setIsInSchool(false);
      }
    };

    updateLocation();
    const id = setInterval(updateLocation, 15000);
    return () => { mounted = false; clearInterval(id); };
  }, [mockEnabled]);

  return { location, errorMsg, isInSchool, mockEnabled, toggleMockLocation };
}
