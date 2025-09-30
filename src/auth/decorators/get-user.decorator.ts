// src/auth/decorators/get-user.decorator.ts

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // 2. Añade el tipo '<Request>' a getRequest()
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user;
  },
);
