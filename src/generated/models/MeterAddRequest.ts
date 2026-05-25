/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MeterTypeEnum } from './MeterTypeEnum';
export type MeterAddRequest = {
    address: string;
    serial_number: string;
    meter_type: MeterTypeEnum;
    meter_model: string;
    installation_date: string;
    initial_reading?: number;
    last_verified_reading?: number;
};

