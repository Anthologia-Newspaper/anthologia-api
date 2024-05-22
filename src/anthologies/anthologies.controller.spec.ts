import { Test, TestingModule } from '@nestjs/testing';
import { AnthologiesController } from './anthologies.controller';
import { AnthologiesService } from './anthologies.service';

describe('AnthologiesController', () => {
  let controller: AnthologiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnthologiesController],
      providers: [AnthologiesService],
    }).compile();

    controller = module.get<AnthologiesController>(AnthologiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
