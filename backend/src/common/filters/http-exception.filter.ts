/* eslint-disable @typescript-eslint/no-explicit-any */
// common/filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'Something went wrong';
    let details: any = undefined;

    // 1) Nest HttpException (bao gồm lỗi từ ZodValidationPipe được wrap thành BadRequestException)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const payload = exception.getResponse() as any;

      // nestjs-zod thường để issues trong payload.issues
      if (exception instanceof BadRequestException && payload?.issues) {
        status = HttpStatus.BAD_REQUEST;
        code = 'VALIDATION_ERROR';
        message = 'Validation failed';
        details = payload.issues; // mảng issue của zod
      } else {
        message = payload?.message ?? exception.message;
        code = payload?.code ?? code;
        details = payload?.details;
      }
    }

    // 2) ZodError chưa được wrap (hiếm, nhưng phòng hờ)
    if (exception instanceof ZodError) {
      status = HttpStatus.BAD_REQUEST;
      code = 'VALIDATION_ERROR';
      message = 'Validation failed';
      details = exception.issues;
    }

    // 3) Prisma errors
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        code = 'DUPLICATE';
        message = 'Resource already exists';
        details = { target: (exception.meta as any)?.target };
      } else if (exception.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        code = 'NOT_FOUND';
        message = 'Resource not found';
      } else {
        status = HttpStatus.BAD_REQUEST;
        code = `PRISMA_${exception.code}`;
        message = exception.message;
      }
    }

    res.status(status).json({
      status,
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
    });
  }
}
