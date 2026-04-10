import { MailerOptions } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";

export const getMailerConfig = (config: ConfigService): MailerOptions => {
    return {
        transport: {
            secure: config.getOrThrow<boolean>('SMTP_SECURE'),
            host: config.getOrThrow<string>('SMTP_HOST'),
            port: config.getOrThrow<number>('SMTP_PORT'),
            service: config.getOrThrow<string>('SMTP_SERVICE'),
            auth: {
                user: config.getOrThrow<string>('SMTP_USER'),
                pass: config.getOrThrow<string>('SMTP_PASSWORD')
            }
        },
        defaults: {
            from: 'skillflow test'
        },
        template: {

        }
    }
}