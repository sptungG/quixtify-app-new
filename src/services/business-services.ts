import { api } from '@/utils/utils-api';

export const ApiBusiness: TApiBusiness = {
  async findAll() {
    return await api.get(`/businesses/`);
  },
  async findById(payload) {
    return await api.get(`/businesses/${payload}/`);
  },
  async create(payload) {
    return await api.post(`/businesses/`, payload);
  },
  async update(id, payload) {
    return await api.put(`/businesses/${id}/`, payload);
  },
  async updatePartial(id, payload) {
    return await api.patch(`/businesses/${id}/`, payload);
  },
  async delete(payload) {
    return await api.delete(`/businesses/${payload}/`);
  },

  //
  async findPlans(params) {
    return await api.get(`/plans/`, params);
  },
  async getBillingPortal(payload) {
    const { business, ...body } = payload;
    return await api.post(
      `/businesses/${business}/stripe/create-customer-portal-session/`,
      body,
    );
  },
  async createCheckoutSession(payload) {
    const { business, ...body } = payload;
    return await api.post(
      `/businesses/${business}/stripe/create-checkout-session/`,
      body,
    );
  },
  async createCheckoutSmsSession(payload) {
    const { business, ...body } = payload;
    return await api.post(
      `/businesses/${business}/sms-purchase/create-checkout-session/`,
      body,
    );
  },
  async downgradePlan(payload) {
    const { business, ...body } = payload;
    return await api.post(`/businesses/${business}/stripe/downgrade/`, body);
  },

  //
  async uploadGallery(params, payload) {
    return await api.post(`/businesses/${params?.business}/gallery/`, payload);
  },
  async findGallery(params?: TFindGalleryBusinessPayload) {
    const { business, ...queryParams } = params || {};
    const res = await api.get(`/businesses/${business}/gallery/`, queryParams);

    if (res.status === 'error') return res;

    return {
      ...res,
      data: ((res.data || []) as unknown as any[]).sort(
        (a, b) => (a?.position || 0) - (b?.position || 0),
      ),
    } as any;
  },
  async reorderGallery(params, payload) {
    return await api.post(
      `/businesses/${params?.business}/gallery/update-positions/`,
      payload,
    );
  },
  async deleteGallery(params) {
    return await api.delete(
      `/businesses/${params?.business}/gallery/${params?.id}/`,
    );
  },
};

// ==================== REPOSITORY INTERFACE ====================

export interface TApiBusiness {
  // Core CRUD operations
  findAll(): Promise<TBusinessEntity[]>;
  findById(payload: string): Promise<TBusinessEntity>;
  create(payload: TCreateBusinessPayload): Promise<TBusinessEntity>;
  update(id: string, payload: TUpdateBusinessPayload): Promise<TBusinessEntity>;
  updatePartial(
    id: string,
    payload: TUpdateBusinessPayload,
    options?: any,
  ): Promise<TBusinessEntity>;
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
  downgradePlan(
    params: TGetBillingPortalBusinessPayload,
  ): Promise<TGetBillingPortalBusinessResult>;

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
