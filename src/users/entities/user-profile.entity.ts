import { UserProfile as UserProfilePrisma } from '@prisma/client';
import { Expose } from 'class-transformer';

export class UserProfileEntity implements Partial<UserProfilePrisma> {
  @Expose()
  id: string;

  @Expose()
  institucion: string;

  @Expose()
  cargo: string;

  @Expose()
  plazoEntregaActa: string;

  constructor(partial: Partial<UserProfileEntity>) {
    Object.assign(this, partial);
  }
}
