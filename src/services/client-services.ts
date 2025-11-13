import { api } from '@/utils/utils-api';

// ==================== API IMPLEMENTATION ====================

export const ApiClient: TApiClient = {
  async findPagination(params) {
    const { business, ...queryParams } = params || {};
    return await api.get(`/businesses/${business}/clients/`, queryParams);
  },
  async findById(params) {
    const { business, id, ...queryParams } = params || {};
    return await api.get(`/businesses/${business}/clients/${id}/`, queryParams);
  },
  async create(params, payload) {
    const { business, ...queryParams } = params || {};
    return await api.post(`/businesses/${business}/clients/`, payload);
  },
  async update(params, payload) {
    const { business, id, ...queryParams } = params || {};
    return await api.patch(`/businesses/${business}/clients/${id}/`, payload);
  },
  async updatePartial(params, payload) {
    const { business, id, ...queryParams } = params || {};
    return await api.patch(`/businesses/${business}/clients/${id}/`, payload);
  },
  async delete(params) {
    const { business, id, ...queryParams } = params || {};
    return await api.delete(`/businesses/${business}/clients/${id}/`);
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
  ): Promise<TClientEntity>;
  update(
    params?: TFindClientPayload,
    payload?: TUpdateClientPayload,
  ): Promise<TClientEntity>;
  updatePartial(
    params?: TFindClientPayload,
    payload?: TUpdateClientPayload,
  ): Promise<TClientEntity>;
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
