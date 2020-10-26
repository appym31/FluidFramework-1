/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import Axios from "axios";
import { config } from "process";
import * as winston from "winston";

export interface IExternalStorageManager {
    read(tenantId: string, documentId: string): Promise<boolean>;

    write(tenantId: string, ref: string, sha: string, update: boolean): Promise<void>;
}

/**
 * Manages api calls to external storage
 */
export class ExternalStorageManager implements IExternalStorageManager {
    constructor(private endpoint: string) {
    }

    public async read(tenantId: string, documentId: string): Promise<boolean> {
        if (config.get("externalStorage:enabled") != "true") {
            winston.info("External storage is not enabled");
            return false;
        }
        await Axios.post<void>(
            `${this.endpoint}/file/${tenantId}/${documentId}`,
            {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
            }).catch((error) => {
                winston.error(`Axios error ${error} tenantId ${tenantId}`);
                throw error;
            });

        return true;
    }

    public async write(tenantId: string, ref: string, sha: string, update: boolean): Promise<void> {
        if (config.get("externalStorage:enabled") != "true") {
            winston.info("External storage is not enabled");
            return;
        }
        await Axios.post<void>(
            `${this.endpoint}/file/${tenantId}`,
            {
                ref,
                sha,
                update,
            },
            {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
            });
    }
}
