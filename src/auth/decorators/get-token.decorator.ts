import { createParamDecorator, ExecutionContext, Inject } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthService } from '../auth.service';

export const GetJwtToken = createParamDecorator((data: string, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context);
  const request = ctx.getContext().req;
  const Authorization = request.get('Authorization');

  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    return token;
  }

  return null;
});
