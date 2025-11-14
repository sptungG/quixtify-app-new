import {
  ApiBusiness,
  ApiClient,
  ApiStaff,
  ApiUser,
  TBusinessEntity,
  TClientEntity,
  TCreateBusinessPayload,
  TCreateCheckoutSessionBusinessPayload,
  TCreateClientPayload,
  TCreateStaffPayload,
  TFindBusinessParams,
  TFindClientPayload,
  TFindGalleryBusinessPayload,
  TFindPaginationClientPayload,
  TFindPaginationStaffPayload,
  TFindStaffPayload,
  TFindUser,
  TGetBillingPortalBusinessPayload,
  TResponse,
  TStaffEntity,
  TUpdateBusinessPayload,
  TUpdateClientPayload,
  TUpdateStaffPayload,
  TUserEntity,
} from '@/services';
import {
  buildPath,
  createGetHook,
  createMutationHook,
  createParamsMutationHook,
} from './useSWRSet';

// ==================== BUSINESS HOOKS (GET) ====================

export const useGetBusinessList = () =>
  createGetHook<TBusinessEntity[]>('/businesses', () => ApiBusiness.findAll());

export const useGetBusinessById = (id?: string) =>
  createGetHook<TBusinessEntity>(
    id ? `/businesses/${id}` : null,
    id ? () => ApiBusiness.findById(id) : null,
  );

export const useGetPlans = () =>
  createGetHook<any>('/plans', () => ApiBusiness.findPlans({}));

export const useGetBusinessGallery = (params?: TFindGalleryBusinessPayload) =>
  createGetHook<any>(
    buildPath(`/businesses/gallery`, params, ['business']),
    params?.business ? () => ApiBusiness.findGallery(params) : null,
  );

// ==================== CLIENT HOOKS (GET) ====================

export const useGetClientList = (params?: TFindPaginationClientPayload) =>
  createGetHook<TResponse<TClientEntity[]>>(
    buildPath(`/businesses/clients`, params, ['business']),
    params?.business ? () => ApiClient.findPagination(params) : null,
  );

export const useGetClientById = (params?: TFindClientPayload) =>
  createGetHook<TClientEntity>(
    buildPath(`/businesses/clients`, params, ['business', 'id']),
    params?.business && params?.id ? () => ApiClient.findById(params) : null,
  );

// ==================== STAFF HOOKS (GET) ====================

export const useGetStaffList = (params?: TFindPaginationStaffPayload) =>
  createGetHook<TStaffEntity[]>(
    buildPath(`/businesses/staff`, params, ['business']),
    params?.business ? () => ApiStaff.findPagination(params) : null,
  );

export const useGetStaffById = (params?: TFindStaffPayload) =>
  createGetHook<TStaffEntity>(
    buildPath(`/businesses/staff`, params, ['business', 'id']),
    params?.business && params?.id ? () => ApiStaff.findById(params) : null,
  );

// ==================== USER HOOKS (GET) ====================

export const useGetCurrentUser = () =>
  createGetHook<TUserEntity>('/users/me', () => ApiUser.findCurrent());

// ==================== BUSINESS MUTATIONS ====================

export const useMutateCreateBusiness = () =>
  createMutationHook<any, TCreateBusinessPayload>('/businesses', arg =>
    ApiBusiness.create(arg),
  );

export const useMutateUpdateBusiness = () =>
  createParamsMutationHook<any, TFindBusinessParams, TUpdateBusinessPayload>(
    '/businesses',
    (params, payload) => ApiBusiness.update(params, payload),
  );

export const useMutateUpdatePartialBusiness = () =>
  createParamsMutationHook<any, TFindBusinessParams, TUpdateBusinessPayload>(
    '/businesses',
    (params, payload, options) =>
      ApiBusiness.updatePartial(params, payload, options),
  );

export const useMutateDeleteBusiness = () =>
  createMutationHook<any, TFindBusinessParams>('/businesses', params =>
    ApiBusiness.delete(params),
  );

// ==================== GALLERY MUTATIONS ====================

export const useMutateUploadGallery = () =>
  createParamsMutationHook<any, any, any>(
    '/businesses/gallery',
    (params, payload, options) =>
      ApiBusiness.uploadGallery(params, payload, options),
  );

export const useMutateReorderGallery = () =>
  createParamsMutationHook<any, any, any>(
    '/businesses/gallery',
    (params, payload) => ApiBusiness.reorderGallery(params, payload),
  );

export const useMutateDeleteGallery = () =>
  createMutationHook<any, any>('/businesses/gallery', arg =>
    ApiBusiness.deleteGallery(arg),
  );

// ==================== BILLING MUTATIONS ====================

export const useMutateGetBillingPortal = () =>
  createMutationHook<any, TGetBillingPortalBusinessPayload>(
    '/businesses/billing',
    arg => ApiBusiness.getBillingPortal(arg),
  );

export const useMutateCreateCheckoutSession = () =>
  createMutationHook<any, TCreateCheckoutSessionBusinessPayload>(
    '/businesses/checkout',
    arg => ApiBusiness.createCheckoutSession(arg),
  );

export const useMutateCreateCheckoutSmsSession = () =>
  createMutationHook<any, any>('/businesses/checkout-sms', arg =>
    ApiBusiness.createCheckoutSmsSession(arg),
  );

export const useMutateDowngradePlan = () =>
  createMutationHook<any, TGetBillingPortalBusinessPayload>(
    '/businesses/downgrade',
    arg => ApiBusiness.downgradePlan(arg),
  );

// ==================== CLIENT MUTATIONS ====================

export const useMutateCreateClient = () =>
  createParamsMutationHook<any, TFindClientPayload, TCreateClientPayload>(
    '/clients',
    (params, payload) => ApiClient.create(params, payload),
  );

export const useMutateUpdateClient = () =>
  createParamsMutationHook<any, TFindClientPayload, TUpdateClientPayload>(
    '/clients',
    (params, payload) => ApiClient.update(params, payload),
  );

export const useMutateUpdatePartialClient = () =>
  createParamsMutationHook<any, TFindClientPayload, TUpdateClientPayload>(
    '/clients',
    (params, payload) => ApiClient.updatePartial(params, payload),
  );

export const useMutateDeleteClient = () =>
  createMutationHook<any, TFindClientPayload>('/clients', arg =>
    ApiClient.delete(arg),
  );

// ==================== STAFF MUTATIONS ====================

export const useMutateCreateStaff = () =>
  createParamsMutationHook<any, TFindStaffPayload, TCreateStaffPayload>(
    '/staff',
    (params, payload) => ApiStaff.create(params, payload),
  );

export const useMutateUpdateStaff = () =>
  createParamsMutationHook<any, TFindStaffPayload, TUpdateStaffPayload>(
    '/staff',
    (params, payload) => ApiStaff.update(params, payload),
  );

export const useMutateUpdatePartialStaff = () =>
  createParamsMutationHook<any, TFindStaffPayload, TUpdateStaffPayload>(
    '/staff',
    (params, payload, options) =>
      ApiStaff.updatePartial(params, payload, options),
  );

export const useMutateDeleteStaff = () =>
  createMutationHook<any, TFindStaffPayload>('/staff', arg =>
    ApiStaff.delete(arg),
  );

// ==================== USER MUTATIONS ====================

export const useMutateDeleteUser = () =>
  createMutationHook<any, TFindUser>('/users', arg => ApiUser.delete(arg));
