import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { timingSafeEqual } from 'crypto';

// Scheduled jobs are triggered externally (GitHub Actions) because serverless
// instances don't stay alive for @Cron timers. Callers must send
// `Authorization: Bearer <CRON_SECRET>`.
@Injectable()
export class CronSecretGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const secret = process.env.CRON_SECRET;
    if (!secret) throw new UnauthorizedException('Cron endpoints are not configured');

    const header: string = context.switchToHttp().getRequest().headers?.authorization ?? '';
    const expected = Buffer.from(`Bearer ${secret}`);
    const actual = Buffer.from(header);
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
