import { api } from '@/utils/utils-api';
import { AxiosRequestConfig } from 'axios';
import { omit } from 'lodash';

export const ApiBusiness: TApiBusiness = {
  // ==================== BUSINESS CRUD ====================

  async findAll() {
    const endpoint = '/businesses/';
    return await api.get(endpoint);
  },

  async findById(payload) {
    const endpoint = `/businesses/${payload}/`;
    return await api.get(endpoint);
  },

  async create(payload) {
    const endpoint = '/businesses/';
    return await api.post(endpoint, payload);
  },

  async update(id, payload) {
    const endpoint = `/businesses/${id}/`;
    return await api.put(endpoint, payload);
  },

  async updatePartial(id, payload, options?: AxiosRequestConfig<any>) {
    const endpoint = `/businesses/${id}/`;
    return await api.patch(endpoint, payload, options);
  },

  async delete(payload) {
    const endpoint = `/businesses/${payload}/`;
    return await api.delete(endpoint);
  },

  // ==================== PLANS & BILLING ====================

  async findPlans(params) {
    const endpoint = '/plans/';
    return await api.get(endpoint);
  },

  async getBillingPortal(payload) {
    const endpoint = `businesses/${payload?.business}/stripe/create-customer-portal-session/`;
    const data = omit(payload, ['business']);
    return await api.post(endpoint, data);
  },

  async createCheckoutSession(payload) {
    const endpoint = `businesses/${payload?.business}/stripe/create-checkout-session/`;
    const data = omit(payload, ['business']);
    return await api.post(endpoint, data);
  },

  async createCheckoutSmsSession(payload) {
    const endpoint = `businesses/${payload?.business}/sms-purchase/create-checkout-session/`;
    const data = omit(payload, ['business']);
    return await api.post(endpoint, data);
  },

  async downgradePlan(payload) {
    const endpoint = `businesses/${payload?.business}/stripe/downgrade/`;
    const data = omit(payload, ['business']);
    return await api.post(endpoint, data);
  },

  // ==================== GALLERY ====================

  async uploadGallery(params, payload, options?: AxiosRequestConfig<any>) {
    const endpoint = `/businesses/${params?.business}/gallery/`;
    return await api.post(endpoint, payload, options);
  },

  async findGallery(params?: TFindGalleryBusinessPayload) {
    const endpoint = `/businesses/${params?.business}/gallery/`;
    const queryParams = omit(params, ['business']);
    const res = await api.get(endpoint, { params: queryParams });
    return ((res || []) as unknown as any[]).sort(
      (a, b) => (a?.position || 0) - (b?.position || 0),
    ) as any;
  },

  async reorderGallery(params, payload) {
    const endpoint = `/businesses/${params?.business}/gallery/update-positions/`;
    return await api.post(endpoint, payload);
  },

  async deleteGallery(params) {
    const endpoint = `/businesses/${params?.business}/gallery/${params?.id}/`;
    return await api.delete(endpoint);
  },
};

// ==================== REPOSITORY INTERFACE ====================

export interface TApiBusiness {
  // Core CRUD operations
  findAll(): Promise<TBusinessEntity[]>;
  findById(payload: string): Promise<TBusinessEntity>;
  create(payload: TCreateBusinessPayload): Promise<any>;
  update(id: string, payload: TUpdateBusinessPayload): Promise<any>;
  updatePartial(
    id: string,
    payload: TUpdateBusinessPayload,
    options?: any,
  ): Promise<any>;
  delete(payload: string): Promise<any>;

  // Subscription & Billing operations
  findPlans(payload?: any): Promise<TBusinessSubscriptionPlanEntity[]>;
  createCheckoutSession(
    payload: TCreateCheckoutSessionBusinessPayload,
  ): Promise<TCreateCheckoutSessionBusinessResult>;
  createCheckoutSmsSession(
    payload: TCreateCheckoutSmsSessionBusinessPayload,
  ): Promise<TCreateCheckoutSessionBusinessResult>;
  getBillingPortal(
    params: TGetBillingPortalBusinessPayload,
  ): Promise<TGetBillingPortalBusinessResult>;
  downgradePlan(params: TGetBillingPortalBusinessPayload): Promise<any>;

  // Gallery operations
  reorderGallery(
    params?: TFindGalleryBusinessPayload,
    payload?: TReorderGalleryBusinessPayload,
  ): Promise<any>;
  uploadGallery(
    params?: TFindGalleryBusinessPayload,
    payload?: TUploadGalleryBusinessPayload,
    options?: any,
  ): Promise<any>;
  findGallery(
    params?: TFindGalleryBusinessPayload,
  ): Promise<TBusinessGalleryEntity[]>;
  deleteGallery(params?: TFindGalleryBusinessPayload): Promise<any>;
}

// ==================== BUSINESS PAYLOADS ====================

export interface TFindBusinessPayload {
  id?: string;
}

export interface TCreateBusinessPayload {
  owner_name?: string;
  id?: string;
  plan?: TBusinessSubscriptionPlanEntity;
  created_at?: string;
  updated_at?: string;
  is_deleted?: boolean;
  deleted_at?: string;
  name?: string;
  logo?: string;
  slug?: string;
  sms_balance?: number;
  address?: TBusinessAddress;
  country?: string;
  phone_number?: string;
  phone_country?: string;
  timezone?: string;
  business_facebook_url?: string;
  business_instagram_url?: string;
  team_size?: number;
  business_hours?: TBusinessHours;
  calendar_interval?: number;
  calendar_slot_size?: number;
  calendar_week_starts_on?: number;
  calendar_day_start_at?: string;
  enable_online_booking?: boolean;
  enable_review_program?: boolean;
  enable_loyalty_program?: boolean;
  enable_birthday_promotion?: boolean;
  enable_auto_confirm_online_booking?: boolean;
  birthday_promotion_days_before?: number;
  birthday_promotion_days_after?: number;
  birthday_promotion_reward?: string;
  birthday_promotion_message_template?: string;
  review_program_facebook_url?: string;
  review_program_google_url?: string;
  loyalty_points_per_visit?: number;
  language?: string;
  cancellation_policy?: string;
  client_notification_preferences?: {
    reminders_1h?: {
      text: boolean;
      email: boolean;
    };
    reminders_24h?: {
      text: boolean;
      email: boolean;
    };
    review_request?: {
      text: boolean;
      email: boolean;
    };
    appointment_no_show?: {
      text: boolean;
      email: boolean;
    };
    appointment_reschedule?: {
      text: boolean;
      email: boolean;
    };
    appointment_cancellation?: {
      text: boolean;
      email: boolean;
    };
    appointment_confirmation?: {
      text: boolean;
      email: boolean;
    };
  };
}

export interface TUpdateBusinessPayload extends TCreateBusinessPayload {}

// ==================== BUSINESS HOURS ====================

export interface TBusinessHour {
  is_working: boolean;
  from: string | null;
  to: string | null;
}

export type TBusinessHours = Record<string, TBusinessHour>;

// ==================== SUBSCRIPTION & PLANS ====================

export interface TBusinessSubscriptionPlanEntity {
  name?: string;
  status?: string;
  limits?: {
    staff?: number;
  };
  stripe_usage_item_id?: string;
}

// @deprecated
export interface TBusinessSubscription {
  id?: string;
  status?: string;
  current_period_end?: string;
  cancel_at_period_end?: boolean;
  plan?: {
    id?: string;
    name?: string;
    features?: {
      enable_review_program?: boolean;
      enable_loyalty_program?: boolean;
      enable_birthday_promotion?: boolean;
    };
    limits?: {
      staff?: number;
    };
    stripe_price_id_monthly?: string;
    stripe_price_id_yearly?: string;
  };
}

export enum TE_subscription_plan {
  Basic = 'BASIC',
  Pro = 'PRO',
}

export const SubscriptionPlanItems = [
  {
    value: 'BASIC',
    label: 'Basic',
  },
  {
    value: 'PRO',
    label: 'Pro',
  },
];

export const getCurrSubsPlan = (v = '') =>
  SubscriptionPlanItems.find(e => String(e.value) === String(v));

// ==================== ADDRESS ====================

export interface TBusinessAddress {
  street_address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

// ==================== BUSINESS ENTITY ====================

export interface TBusinessEntity {
  id?: string;
  plan?: TBusinessSubscriptionPlanEntity;
  // @deprecated
  subscription?: TBusinessSubscription;
  created_at?: string;
  updated_at?: string;
  is_deleted?: boolean;
  deleted_at?: string;
  name?: string;
  logo?: string;
  slug?: string;
  sms_balance?: number;
  address?: TBusinessAddress;
  country?: string;
  phone_number?: string;
  phone_country?: string;
  timezone?: string;
  business_facebook_url?: string;
  business_instagram_url?: string;
  team_size?: number;
  business_hours?: TBusinessHours;
  calendar_interval?: number;
  calendar_slot_size?: number;
  calendar_week_starts_on?: number;
  calendar_day_start_at?: string;
  enable_online_booking?: boolean;
  enable_review_program?: boolean;
  enable_loyalty_program?: boolean;
  enable_birthday_promotion?: boolean;
  enable_auto_confirm_online_booking?: boolean;
  birthday_promotion_days_before?: number;
  birthday_promotion_days_after?: number;
  birthday_promotion_reward?: string;
  birthday_promotion_message_template?: string;
  language?: string;
  review_program_facebook_url?: string;
  review_program_google_url?: string;
  loyalty_points_per_visit?: number;
  cancellation_policy?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  client_notification_preferences?: {
    reminders_1h?: {
      text: boolean;
      email: boolean;
    };
    reminders_24h?: {
      text: boolean;
      email: boolean;
    };
    review_request?: {
      text: boolean;
      email: boolean;
    };
    appointment_no_show?: {
      text: boolean;
      email: boolean;
    };
    appointment_reschedule?: {
      text: boolean;
      email: boolean;
    };
    appointment_cancellation?: {
      text: boolean;
      email: boolean;
    };
    appointment_confirmation?: {
      text: boolean;
      email: boolean;
    };
  };
}

// ==================== BILLING & CHECKOUT ====================

export interface TGetBillingPortalBusinessPayload {
  business: string;
}

export interface TGetBillingPortalBusinessResult {
  portal_url?: string;
}

export interface TCreateCheckoutSessionBusinessPayload {
  business?: string;
  plan_name: string;
  billing_cycle: string;
}

export interface TCreateCheckoutSmsSessionBusinessPayload {
  business?: string;
  lookup_key: string;
}

export interface TCreateCheckoutSessionBusinessResult {
  checkout_url?: string;
  detail?: string;
}

// ==================== GALLERY ====================

export interface TBusinessGalleryEntity {
  id: string;
  image: string;
  business: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface TFindGalleryBusinessPayload {
  business?: string;
  id?: string;
}

export interface TReorderItem {
  id: string;
  position: number;
}

export interface TReorderGalleryBusinessPayload {
  business?: string;
  positions?: TReorderItem[];
}

export interface TUploadGalleryBusinessPayload {
  business?: string;
  image?: any;
}
