import { api } from '@/utils/utils-api';
import { AxiosRequestConfig } from 'axios';
import { omit } from 'lodash';
import { TBusinessHours } from './business-services';
import { TBaseFilter } from './common-type';

// ==================== API IMPLEMENTATION ====================

export const ApiStaff: TApiStaff = {
  async findPagination(params) {
    const endpoint = `/businesses/${params?.business}/staff/`;
    const queryParams = omit(params, ['business']);
    const res = await api.get(endpoint, { params: queryParams });
    return (res || []) as unknown as any[];
  },

  async findById(params) {
    const endpoint = `/businesses/${params?.business}/staff/${params?.id}/`;
    const queryParams = omit(params, ['business']);
    return await api.get(endpoint, { params: queryParams });
  },

  async create(params, payload) {
    const endpoint = `/businesses/${params?.business}/staff/`;
    return await api.post(endpoint, payload);
  },

  async update(params, payload) {
    const endpoint = `/businesses/${params?.business}/staff/${params?.id}/`;
    return await api.put(endpoint, payload);
  },

  async updatePartial(params, payload, options?: AxiosRequestConfig<any>) {
    const endpoint = `/businesses/${params?.business}/staff/${params?.id}/`;
    return await api.patch(endpoint, payload, options);
  },

  async delete(params) {
    const endpoint = `/businesses/${params?.business}/staff/${params?.id}/`;
    return await api.delete(endpoint);
  },
};

// ==================== API INTERFACE ====================

export interface TApiStaff {
  findPagination(params?: TFindPaginationStaffPayload): Promise<TStaffEntity[]>;
  findById(params?: TFindStaffPayload): Promise<TStaffEntity>;
  create(
    params?: TFindStaffPayload,
    payload?: TCreateStaffPayload,
  ): Promise<TStaffEntity>;
  update(
    params?: TFindStaffPayload,
    payload?: TUpdateStaffPayload,
  ): Promise<TStaffEntity>;
  updatePartial(
    params?: TFindStaffPayload,
    payload?: TUpdateStaffPayload,
    options?: AxiosRequestConfig<any>,
  ): Promise<TStaffEntity>;
  delete(params?: TFindStaffPayload): Promise<any>;
}

// ==================== ROLES & CONSTANTS ====================

export enum TERoles {
  ROLE_OWNER = 'OWNER',
  ROLE_BASIC = 'BASIC',
  ROLE_MANAGER = 'MANAGER',
}

export const TERoles_ALL = Object.values(TERoles);

export const RoleOrder: Record<string, number> = {
  OWNER: 1,
  MANAGER: 2,
  BASIC: 3,
};

export const STAFF_ROLES = [
  {
    value: 'OWNER',
    label: 'Owner',
    desc: 'Full control over all settings and operations',
  },
  {
    value: 'MANAGER',
    label: 'Manager',
    desc: 'Oversee operations and manage team activities',
  },
  {
    value: 'BASIC',
    label: 'Basic',
    desc: 'Access essential tools for daily tasks',
  },
];

export const getRole = (role?: string) => {
  return STAFF_ROLES.find(r => r.value === role);
};

// ==================== TYPES & INTERFACES ====================

export interface TFindPaginationStaffPayload extends TBaseFilter {
  business?: string;
}

export interface TFindStaffPayload {
  business?: string;
  id?: string;
}

export interface TCreateStaffPayload {
  role?: string;
  name?: string;
  display_name?: string;
  phone_number?: string;
  avatar?: string | null;
  working_hours?: TBusinessHours;
  notification_preferences?: {
    daily_schedule_summary?: {
      sms: boolean;
      push: boolean;
      email: boolean;
    };
    appointment_confirmation?: {
      sms: boolean;
      push: boolean;
      email: boolean;
    };
  };
  business?: string;
  email?: string;
  firebase_uid?: string;
  position?: number;
  phone_country?: string;
  services?: string[];
  enable_online_booking?: boolean;
  user?: string;
}

export interface TUpdateStaffPayload extends TCreateStaffPayload {}

export interface TStaffEntity {
  id?: string;
  role?: string;
  name?: string;
  display_name?: string;
  phone_number?: string;
  avatar?: string | null;
  working_hours?: TBusinessHours;
  notification_preferences?: {
    daily_schedule_summary?: {
      sms: boolean;
      push: boolean;
      email: boolean;
    };
    appointment_confirmation?: {
      sms: boolean;
      push: boolean;
      email: boolean;
    };
  };
  business?: {
    id: string;
    name: string;
    logo: string | null;
  };
  email?: string;
  firebase_uid?: string;
  position?: number;
  phone_country?: string;
  services?: string[];
  enable_online_booking?: boolean;
  user?: string;
}
