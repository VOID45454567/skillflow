import { ConfigModuleOptions } from "@nestjs/config";

export const ConfigModuleParams: ConfigModuleOptions = {
    isGlobal: true,
    envFilePath: '.env'
}