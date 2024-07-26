import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class StandardResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        if (context.switchToHttp().getRequest().query.curPage && context.switchToHttp().getRequest().query.perPage) {
          return {
            httpStatusCode: context.switchToHttp().getResponse().statusCode,
            message: 'success',
            data: data,
            pagingInfo: { curPage: context.switchToHttp().getRequest().query.curPage, perPage: context.switchToHttp().getRequest().query.perPage }
          };
        } else {
          return {
            httpStatusCode: context.switchToHttp().getResponse().statusCode,
            message: 'success',
            data: data
          };
        }
      })
    );
  }
}
