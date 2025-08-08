import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUser } from '../../common/types/user.types';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as RequestUser;
  },
);
