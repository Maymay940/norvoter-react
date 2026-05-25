/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PositionAddRequest } from '../models/PositionAddRequest';
import type { PositionUpdateRequest } from '../models/PositionUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PositionsService {
    /**
     * @param positionId
     * @returns void
     * @throws ApiError
     */
    public static positionsDeleteDestroy(
        positionId: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/positions/{position_id}/delete/',
            path: {
                'position_id': positionId,
            },
        });
    }
    /**
     * @param positionId
     * @param requestBody
     * @returns any No response body
     * @throws ApiError
     */
    public static positionsUpdateUpdate(
        positionId: number,
        requestBody: PositionUpdateRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/positions/{position_id}/update/',
            path: {
                'position_id': positionId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any No response body
     * @throws ApiError
     */
    public static positionsAddCreate(
        requestBody: PositionAddRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/positions/add/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
