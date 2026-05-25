/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RequestUpdateRequest } from '../models/RequestUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RequestsService {
    /**
     * @returns any No response body
     * @throws ApiError
     */
    public static requestsRetrieve(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/requests/',
        });
    }
    /**
     * @param requestId
     * @returns any No response body
     * @throws ApiError
     */
    public static requestsRetrieve2(
        requestId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/requests/{request_id}/',
            path: {
                'request_id': requestId,
            },
        });
    }
    /**
     * @param requestId
     * @returns any No response body
     * @throws ApiError
     */
    public static requestsCompleteUpdate(
        requestId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/requests/{request_id}/complete/',
            path: {
                'request_id': requestId,
            },
        });
    }
    /**
     * @param requestId
     * @returns void
     * @throws ApiError
     */
    public static requestsDeleteDestroy(
        requestId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/requests/{request_id}/delete/',
            path: {
                'request_id': requestId,
            },
        });
    }
    /**
     * @param requestId
     * @returns any No response body
     * @throws ApiError
     */
    public static requestsRejectUpdate(
        requestId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/requests/{request_id}/reject/',
            path: {
                'request_id': requestId,
            },
        });
    }
    /**
     * @param requestId
     * @returns any No response body
     * @throws ApiError
     */
    public static requestsSubmitRequestUpdate(
        requestId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/requests/{request_id}/submit-request/',
            path: {
                'request_id': requestId,
            },
        });
    }
    /**
     * @param requestId
     * @param requestBody
     * @returns any No response body
     * @throws ApiError
     */
    public static requestsUpdateUpdate(
        requestId: number,
        requestBody?: RequestUpdateRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/requests/{request_id}/update/',
            path: {
                'request_id': requestId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
