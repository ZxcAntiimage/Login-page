import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  serializeUser(user: any, done: (err: Error | null, user: any) => void) {
    done(null, user.id);
  }

  async deserializeUser(userId: number, done: (err: Error | null, user: any) => void) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return done(new Error('User not found'), null);
      }

      const { password, ...result } = user;
      done(null, result);
    } catch (error) {
      done(error instanceof Error ? error : new Error('Deserialization failed'), null);
    }
  }
}