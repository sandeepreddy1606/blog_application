import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info, context, status) {
        // Return null if there's no user or an error, instead of throwing an exception
        if (err || !user) {
            return null;
        }
        return user;
    }
}
