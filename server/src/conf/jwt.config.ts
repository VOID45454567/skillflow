import { JwtModuleOptions } from "@nestjs/jwt";

export const jwtConfig: JwtModuleOptions = {
    secret: process.env['JWT_SECRET'] || 'secret-123',
    global: true,
    signOptions: { expiresIn: '5d' },
}