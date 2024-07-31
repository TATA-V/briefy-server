import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from './strategy/google.strategy';
import { SocialService } from './social/social.service';
import { GoogleController } from './social/google.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [JwtModule.register({}), UserModule],
  controllers: [GoogleController, AuthController],
  providers: [SocialService, GoogleStrategy, AuthService],
})
export class AuthModule {}
