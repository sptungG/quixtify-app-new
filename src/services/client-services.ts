import { api } from '@/utils/utils-api';
import { omit } from 'lodash';
import { TResponse } from './common-type';

// ==================== API IMPLEMENTATION ====================

export const ApiClient: TApiClient = {
  async findPagination(params) {
    const endpoint = `/businesses/${params?.business}/clients/`;
    const queryParams = omit(params, ['business']);
    return await api.get(endpoint, { params: queryParams });
  },

  async findById(params) {
    const endpoint = `/businesses/${params?.business}/clients/${params?.id}/`;
    const queryParams = omit(params, ['business', 'id']);
    return await api.get(endpoint, { params: queryParams });
  },

  async create(params, payload) {
    const endpoint = `/businesses/${params?.business}/clients/`;
    const queryParams = omit(params, ['business']);
    return await api.post(endpoint, payload, { params: queryParams });
  },

  async update(params, payload) {
    const endpoint = `/businesses/${params?.business}/clients/${params?.id}/`;
    const queryParams = omit(params, ['business']);
    return await api.patch(endpoint, payload, { params: queryParams });
  },

  async updatePartial(params, payload) {
    const endpoint = `/businesses/${params?.business}/clients/${params?.id}/`;
    const queryParams = omit(params, ['business']);
    return await api.patch(endpoint, payload, { params: queryParams });
  },

  async delete(params) {
    const endpoint = `/businesses/${params?.business}/clients/${params?.id}/`;
    const queryParams = omit(params, ['business']);
    return await api.delete(endpoint, { params: queryParams });
  },
};

// ==================== API INTERFACE ====================

export interface TApiClient {
  findPagination(
    params?: TFindPaginationClientPayload,
  ): Promise<TResponse<TClientEntity[]>>;
  findById(params?: TFindClientPayload): Promise<TClientEntity>;
  create(
    params?: TFindClientPayload,
    payload?: TCreateClientPayload,
  ): Promise<any>;
  update(
    params?: TFindClientPayload,
    payload?: TUpdateClientPayload,
  ): Promise<any>;
  updatePartial(
    params?: TFindClientPayload,
    payload?: TUpdateClientPayload,
  ): Promise<any>;
  delete(params?: TFindClientPayload): Promise<any>;
}

// ==================== ENUMS ====================

export enum TEFilter {
  ALL = 'all',
  FIRST_VISIT = 'first_visit',
  NOT_BOOKED_30 = 'not_booked_30',
  NOT_BOOKED_60 = 'not_booked_60',
  NOT_BOOKED_90 = 'not_booked_90',
  VIP = 'vip',
  BLOCKED = 'blocked',
}

// ==================== TYPES ====================

type TAppointmentEntity = any;

// ==================== PAYLOADS ====================

export interface TFindPaginationClientPayload {
  business?: string;
  filter?: string;
  //
  page?: number | null;
  page_size?: number | null;
  search?: string;
  ordering?: string | null;
}

export interface TFindClientPayload {
  business?: string;
  id?: string;
}

export interface TCreateClientPayload {
  appointments?: TAppointmentEntity[];
  email?: string;
  phone_number?: string;
  phone_country?: string;
  created_at?: string;
  updated_at?: string;
  is_deleted?: boolean;
  deleted_at?: string;
  name?: string;
  dob?: string;
  avatar?: string;
  note?: string;
  address?: string;
  is_blocked?: boolean;
  is_vip?: boolean;
  notification_preferences?: {
    marketing?: {
      text: boolean;
      email: boolean;
    };
    appointment_updates?: {
      text: boolean;
      email: boolean;
    };
  };
  loyalty_enrolled?: boolean;
  loyalty_points_balance?: number;
  user?: string;
  business?: string;
}

export interface TUpdateClientPayload extends TCreateClientPayload {}

// ==================== ENTITIES ====================

export interface TClientEntity {
  id?: string;
  appointments?: TAppointmentEntity[];
  email?: string;
  phone_number?: string;
  phone_country?: string;
  created_at?: string;
  updated_at?: string;
  is_deleted?: boolean;
  deleted_at?: string;
  name?: string;
  dob?: string;
  avatar?: string;
  note?: string;
  address?: string;
  is_blocked?: boolean;
  is_vip?: boolean;
  ltv?: number;
  notification_preferences?: {
    marketing?: {
      text: boolean;
      email: boolean;
    };
    appointment_updates?: {
      text: boolean;
      email: boolean;
    };
  };
  loyalty_enrolled?: boolean;
  loyalty_points_balance?: number;
  user?: string;
  business?: string;
}
