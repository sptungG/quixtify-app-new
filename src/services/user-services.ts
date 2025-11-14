import { api } from '@/utils/utils-api';
import { TBusinessHours } from './business-services';
import { TStaffEntity } from './staff-services';

// ==================== API IMPLEMENTATION ====================

export const ApiUser: TApiUser = {
  async findCurrent() {
    const endpoint = '/users/me/';
    return await api.get(endpoint);
  },

  async delete(params) {
    const endpoint = `/users/${params?.id}/`;
    return await api.delete(endpoint);
  },
};

// ==================== API INTERFACE ====================

export interface TApiUser {
  findCurrent(): Promise<TUserEntity>;
  delete(payload: TFindUser): Promise<any>;
}

// ==================== REQUEST PAYLOADS ====================

export interface TFindUser {
  id?: string;
}

export interface TSignUpPayload {
  user: string;
  name: string;
  display_name?: string;
  email: string;
  working_hours?: TBusinessHours;
  business_name: string;
  business_address?: string;
  business_timezone?: string;
  business_phone_number?: string;
  business_phone_country?: string;
  business_country_code?: string;
  business_team_size?: number;
}

// ==================== RESPONSE TYPES ====================

export interface TSignUpResult {
  staff_id: string;
  business_ids: string[];
}

export interface TUserEntity {
  id: string;
  email: string;
  firebase_uid: string;
  name?: string;
  staffs: TStaffEntity[];
}
