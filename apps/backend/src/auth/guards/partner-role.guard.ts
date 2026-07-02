import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { SessionService } from "../services/session.service";

/**
 * NestJS Guard that secures backend REST/controller endpoints
 * for B2B partner users with role 'wholesale'.
 */
@Injectable()
export class PartnerRoleGuard implements CanActivate {
  constructor(
    @Inject(SessionService)
    private readonly sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const session = await this.sessionService.resolveSession(request);

    if (!session) {
      throw new UnauthorizedException("احراز هویت الزامی است");
    }

    if (session.role !== "wholesale") {
      throw new ForbiddenException("دسترسی همکار الزامی است");
    }

    // Attach session data to request object
    request.session = session;
    return true;
  }
}
