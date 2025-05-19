import { UserRole } from '../entities/usuario.entity';

export class CreateUsuarioDto {
  login: string;
  password: string;
  role?: UserRole; // Opcional ao criar (default: visitante)
}
