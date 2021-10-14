import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RateLimiterGuard, RateLimiterModule } from "nestjs-rate-limiter";
import { HttpLoggerMiddleWare } from "./middlewares/http-logger.middleware";
import { APP_GUARD } from "@nestjs/core";
import { rateLimiterOptions } from "./config/rate-limiter";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MailerModule } from "@nestjs-modules/mailer";
import { mailerAsyncOptions } from "./config/mailer";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        RateLimiterModule.register(rateLimiterOptions),
        TypeOrmModule.forRoot(),
        MailerModule.forRootAsync(mailerAsyncOptions),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: RateLimiterGuard,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(HttpLoggerMiddleWare).forRoutes("*");
    }
}
