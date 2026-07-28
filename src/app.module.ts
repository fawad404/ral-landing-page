import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FacilitiesModule } from './facilities/facilities.module';
import { PartnersModule } from './partners/partners.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { MatchingModule } from './matching/matching.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CmsModule } from './cms/cms.module';
import { AdminModule } from './admin/admin.module';
import { ReportsModule } from './reports/reports.module';
import { PublicModule } from './public/public.module';
import { IntelligenceHubModule } from './intelligence-hub/intelligence-hub.module';
import { SocialBoostModule } from './social-boost/social-boost.module';
import { DealRoomModule } from './deal-room/deal-room.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ComplianceModule } from './compliance/compliance.module';
import { MailModule } from './mail/mail.module';
import { LeadsModule } from './leads/leads.module';
import { DemoInquiriesModule } from './demo-inquiries/demo-inquiries.module';
import { CaregiversModule } from './caregivers/caregivers.module';
import { AvailabilityBroadcastModule } from './availability-broadcast/availability-broadcast.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    FacilitiesModule,
    PartnersModule,
    InquiriesModule,
    MatchingModule,
    NotificationsModule,
    CmsModule,
    AdminModule,
    ReportsModule,
    PublicModule,
    IntelligenceHubModule,
    SocialBoostModule,
    DealRoomModule,
    CloudinaryModule,
    ComplianceModule,
    MailModule,
    LeadsModule,
    DemoInquiriesModule,
    CaregiversModule,
    AvailabilityBroadcastModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
