import { ConfigService } from "@nestjs/config";
import { NestMinioOptions } from "nestjs-minio";

export const getMinioConfig = (config: ConfigService): NestMinioOptions => {
    return {
        accessKey: config.getOrThrow<string>("S3_API_KEY_Id"),
        secretKey: config.getOrThrow<string>("S3_API_PRIVATE_KEY"),
        endPoint: 'storage.yandexcloud.net',
        port: 443,
        useSSL: true
    }
}