import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlockService } from './block.service';
import { BlockSchema, Block } from './schema/block.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Block.name, schema: BlockSchema }]),
  ],
  providers: [BlockService],
  exports: [BlockService],
})
export class BlockModule {}
