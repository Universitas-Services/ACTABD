import { User as UserPrisma, UserRole } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer'; // <--- 1. Importa 'Type'
import { UserProfileEntity } from './user-profile.entity';

export class User implements Partial<UserPrisma> {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Exclude()
  password_hash: string;

  @Expose()
  nombre: string;

  @Expose()
  apellido: string;

  @Expose()
  telefono: string;

  @Expose()
  role: UserRole;

  @Expose()
  is_email_verified: boolean;

  @Exclude()
  confirmation_token: string;

  @Exclude()
  reset_token: string;

  @Exclude()
  reset_token_expires: Date;

  @Exclude()
  hashed_refresh_token: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  // --- 👇 AÑADIR ESTAS TRES LÍNEAS ---
  @Expose() // Le dice al serializador que incluya esta propiedad
  @Type(() => UserProfileEntity) // Le dice al serializador cómo transformar el objeto anidado
  profile: UserProfileEntity;
  // --- FIN DE LA MODIFICACIÓN ---

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
