import { ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    try {
      const ctx = GqlExecutionContext.create(context);
      const request = ctx.getContext().req;
      const Authorization = request.get('Authorization');

      if (Authorization) {
        const token = Authorization.replace('Bearer ', '');
        const authorized = await this.authService.isMatchStoragedToken(token);
        if (authorized) return true;
        throw new UnauthorizedException('Some one just login with your account !');
      }
      return false;
    } catch (err) {
      if (!(err instanceof UnauthorizedException)) {
        throw new UnauthorizedException();
      }
      throw err;
    }
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
