import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export const useDoctors = () => {
  return useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const { data } = await api.get('/doctors');
      return data;
    },
  });
};

export const useDoctorBySpecialty = (specialty) => {
  return useQuery({
    queryKey: ['doctors', specialty],
    queryFn: async () => {
      const { data } = await api.get(`/doctors/specialty/${specialty}`);
      return data;
    },
    enabled: !!specialty,
  });
};
