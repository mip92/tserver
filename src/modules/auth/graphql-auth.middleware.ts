import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { JwtService } from "@nestjs/jwt";

interface RequestWithUser extends Request {
  user?: any;
}

@Injectable()
export class GraphQLAuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: RequestWithUser, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);

      try {
        const payload = this.jwtService.verify(token);
        req.user = payload;
      } catch (error) {
        // Токен недействителен, но продолжаем выполнение
        // GraphQL resolver сам проверит аутентификацию через guard
      }
    }

    next();
  }
}
