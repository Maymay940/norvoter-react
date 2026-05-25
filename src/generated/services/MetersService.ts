/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MeterAddRequest } from '../models/MeterAddRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MetersService {
    /**
     * @returns any Успешный ответ
     * @throws ApiError
     */
    public static metersList(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/meters/',
        });
    }
    /**
     * @param meterId
     * @returns any No response body
     * @throws ApiError
     */
    public static metersRetrieve(
        meterId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/meters/{meter_id}/',
            path: {
                'meter_id': meterId,
            },
        });
    }
    /**
     * @param requestBody
     * @returns any No response body
     * @throws ApiError
     */
    public static metersAddCreate(
        requestBody: MeterAddRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/meters/add/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
