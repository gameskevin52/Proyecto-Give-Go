import { apiClient } from '../../../services/api/apiClient';
import { UserProfile, UpdateProfilePayload } from '../models/profile.models';

export const profileFeatureService = {
  async getProfile(): Promise<UserProfile> {
    const res = await apiClient.get('/users/profile');
    return res.data.data;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    const res = await apiClient.put('/users/profile', payload);
    return res.data.data;
  },

  async deleteAccount(id: number): Promise<boolean> {
    const res = await apiClient.delete(`/users/${id}`);
    return res.data.success;
  },
};

export default profileFeatureService;
