// src/services/apiGenerated.ts
import type { RequestParams, RegisterRequest, MeterAddRequest, PositionAddRequest, PositionUpdateRequest, RequestUpdateRequest } from '../generated/api';
import { Api } from '../generated/api';

const api = new Api({
  baseURL: '/api',
  withCredentials: true,
});

export const login = (username: string, password: string) => {
  return api.api.usersLoginCreate({ username, password });
};

export const register = (userData: RegisterRequest) => {
  return api.api.usersRegisterCreate(userData);
};

export const logout = () => {
  return api.api.usersLogoutCreate();
};

export const getMeters = (params?: RequestParams) => {
  return api.api.metersRetrieve(params);
};

export const getMeterById = (meterId: number) => {
  return (api.api.metersRetrieve as (id: number, params?: RequestParams) => Promise<any>)(meterId);
};

export const addMeter = (data: MeterAddRequest) => {
  return api.api.metersAddCreate(data);
};

export const getCart = () => {
  return api.api.cartRetrieve();
};

export const getFreeAccounts = () => {
  return api.api.freeAccountsRetrieve();
};

export const addPosition = (data: PositionAddRequest) => {
  return api.api.positionsAddCreate(data);
};

export const updatePosition = (positionId: number, data: PositionUpdateRequest) => {
  return api.api.positionsUpdateUpdate(positionId, data);
};

export const deletePosition = (positionId: number) => {
  return api.api.positionsDeleteDestroy(positionId);
};

export const getRequests = (params?: RequestParams) => {
  return api.api.requestsRetrieve(params);
};

export const getRequestById = (requestId: number) => {
  return api.api.requestsRetrieve2(requestId);
};

export const updateRequest = (requestId: number, data: RequestUpdateRequest) => {
  return api.api.requestsUpdateUpdate(requestId, data);
};

export const submitRequest = (requestId: number) => {
  return api.api.requestsSubmitRequestUpdate(requestId);
};

export const completeRequest = (requestId: number) => {
  return api.api.requestsCompleteUpdate(requestId);
};

export const rejectRequest = (requestId: number) => {
  return api.api.requestsRejectUpdate(requestId);
};

export const deleteRequest = (requestId: number) => {
  return api.api.requestsDeleteDestroy(requestId);
};