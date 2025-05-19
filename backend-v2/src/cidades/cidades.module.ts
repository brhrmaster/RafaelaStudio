import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cidade } from '../entities/cidade.entity';
import { CidadesController } from './cidades.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cidade])],
  controllers: [CidadesController],
})
export class CidadesModule {}
