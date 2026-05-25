/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FreeAccountsService {
    /**
     * GET список лицевых счетов, не привязанных к пользователю
     * @returns any No response body
     * @throws ApiError
     */
    public static freeAccountsRetrieve(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/free-accounts/',
        });
    }
}
