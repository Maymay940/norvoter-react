/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/**
 * * `HOT` - HOT
 * * `COLD` - COLD
 */
export enum MeterTypeEnum {
  HOT = "HOT",
  COLD = "COLD",
}

export interface Login {
  /** @maxLength 100 */
  username: string;
}

export interface LoginRequest {
  /**
   * @minLength 1
   * @maxLength 100
   */
  username: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  password: string;
}

export interface MeterAddRequest {
  /**
   * @minLength 1
   * @maxLength 255
   */
  address: string;
  /**
   * @minLength 1
   * @maxLength 50
   */
  serial_number: string;
  /**
   * * `HOT` - HOT
   * * `COLD` - COLD
   */
  meter_type: MeterTypeEnum;
  /**
   * @minLength 1
   * @maxLength 100
   */
  meter_model: string;
  /** @format date */
  installation_date: string;
  /** @default 0 */
  initial_reading?: number;
  /** @default 0 */
  last_verified_reading?: number;
}

export interface PositionAddRequest {
  meter_id: number;
  current_reading: number;
  request_id?: number | null;
}

export interface PositionUpdateRequest {
  current_reading: number;
}

export interface RegisterRequest {
  /**
   * @minLength 1
   * @maxLength 100
   */
  username: string;
  /**
   * @format email
   * @minLength 1
   */
  email: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  password: string;
  /**
   * @minLength 1
   * @maxLength 50
   */
  account_number: string;
  /** @maxLength 100 */
  first_name?: string;
  /** @maxLength 100 */
  last_name?: string;
  /** @maxLength 20 */
  phone?: string;
}

export interface RequestUpdateRequest {
  comment?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance
      .request({
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type ? { "Content-Type": type } : {}),
        },
        params: query,
        responseType: responseFormat,
        data: body,
        url: path,
      })
      .then((response) => response.data);
  };
}

/**
 * @title Norvoter API
 * @version 1.0.0
 *
 * API для учёта показаний счётчиков воды
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags cart
     * @name CartRetrieve
     * @request GET:/api/cart/
     */
    cartRetrieve: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/cart/`,
        method: "GET",
        ...params,
      }),

    /**
     * @description GET список лицевых счетов, не привязанных к пользователю
     *
     * @tags free-accounts
     * @name FreeAccountsRetrieve
     * @request GET:/api/free-accounts/
     */
    freeAccountsRetrieve: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/free-accounts/`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags meters
     * @name MetersRetrieve
     * @request GET:/api/meters/
     */
    metersRetrieve: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/api/meters/`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags meters
     * @name MetersRetrieve2
     * @request GET:/api/meters/{meter_id}/
     */
    metersRetrieve2: (meterId: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/meters/${meterId}/`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags meters
     * @name MetersAddCreate
     * @request POST:/api/meters/add/
     */
    metersAddCreate: (data: MeterAddRequest, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/meters/add/`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags positions
     * @name PositionsDeleteDestroy
     * @request DELETE:/api/positions/{position_id}/delete/
     */
    positionsDeleteDestroy: (positionId: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/positions/${positionId}/delete/`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags positions
     * @name PositionsUpdateUpdate
     * @request PUT:/api/positions/{position_id}/update/
     */
    positionsUpdateUpdate: (
      positionId: number,
      data: PositionUpdateRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/positions/${positionId}/update/`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags positions
     * @name PositionsAddCreate
     * @request POST:/api/positions/add/
     */
    positionsAddCreate: (
      data: PositionAddRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/positions/add/`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags requests
     * @name RequestsRetrieve
     * @request GET:/api/requests/
     */
    requestsRetrieve: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/requests/`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requests
     * @name RequestsRetrieve2
     * @request GET:/api/requests/{request_id}/
     */
    requestsRetrieve2: (requestId: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/requests/${requestId}/`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requests
     * @name RequestsCompleteUpdate
     * @request PUT:/api/requests/{request_id}/complete/
     */
    requestsCompleteUpdate: (requestId: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/requests/${requestId}/complete/`,
        method: "PUT",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requests
     * @name RequestsDeleteDestroy
     * @request DELETE:/api/requests/{request_id}/delete/
     */
    requestsDeleteDestroy: (requestId: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/requests/${requestId}/delete/`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requests
     * @name RequestsRejectUpdate
     * @request PUT:/api/requests/{request_id}/reject/
     */
    requestsRejectUpdate: (requestId: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/requests/${requestId}/reject/`,
        method: "PUT",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requests
     * @name RequestsSubmitRequestUpdate
     * @request PUT:/api/requests/{request_id}/submit-request/
     */
    requestsSubmitRequestUpdate: (
      requestId: number,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/requests/${requestId}/submit-request/`,
        method: "PUT",
        ...params,
      }),

    /**
     * No description
     *
     * @tags requests
     * @name RequestsUpdateUpdate
     * @request PUT:/api/requests/{request_id}/update/
     */
    requestsUpdateUpdate: (
      requestId: number,
      data: RequestUpdateRequest,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/requests/${requestId}/update/`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersLoginCreate
     * @request POST:/api/users/login/
     */
    usersLoginCreate: (data: LoginRequest, params: RequestParams = {}) =>
      this.request<Login, void>({
        path: `/api/users/login/`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersLogoutCreate
     * @request POST:/api/users/logout/
     */
    usersLogoutCreate: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/users/logout/`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags users
     * @name UsersRegisterCreate
     * @request POST:/api/users/register/
     */
    usersRegisterCreate: (data: RegisterRequest, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/users/register/`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
}
