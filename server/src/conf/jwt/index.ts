import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";


export const getJwtConfig = (config: ConfigService): JwtModuleOptions => ({
    global: true,
    secret: config.getOrThrow<string>('JWT_SECRET'),
    signOptions: {
        expiresIn: '10m'
    }
});