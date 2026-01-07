import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET') || 'your-super-secure-jwt-secret-key-here-change-this-in-production',
        });
    }

    async validate(payload: any) {
        // Expose both userId and sub for existing controllers
        return { userId: payload.sub, sub: payload.sub, email: payload.email, role: payload.role };
    }
}
