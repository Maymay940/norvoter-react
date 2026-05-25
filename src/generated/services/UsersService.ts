/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginRequest } from '../models/LoginRequest';
import type { RegisterRequest } from '../models/RegisterRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * @param requestBody
     * @returns any No response body
     * @throws ApiError
     */
    public static usersLoginCreate(
        requestBody: LoginRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/users/login/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns any No response body
     * @throws ApiError
     */
    public static usersLogoutCreate(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/users/logout/',
        });
    }
    /**
     * @param requestBody
     * @returns any No response body
     * @throws ApiError
     */
    public static usersRegisterCreate(
        requestBody: RegisterRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/users/register/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
