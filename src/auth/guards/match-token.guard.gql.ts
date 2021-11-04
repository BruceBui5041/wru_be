import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from '../auth.service';

@Injectable()
export class GqlMatchStoredTokenGuard implements CanActivate {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    try {
      const ctx = GqlExecutionContext.create(context);
      const request = ctx.getContext().req;
      const Authorization = request.get('Authorization');

      if (Authorization) {
        const token = Authorization.replace('Bearer ', '');
        const authorized = await this.authService.isMatchStoragedToken(token);
        if (authorized) return true;
        throw new UnauthorizedException(
          'Some one just login with your account !',
        );
      }
      return false;
    } catch (err) {
      if (!(err instanceof UnauthorizedException)) {
        throw new UnauthorizedException('Your login token is expired');
      }
      throw err;
    }
  }
}
