import { Test, TestingModule } from '@nestjs/testing';
import { AnthologiesService } from './anthologies.service';

describe('AnthologiesService', () => {
  let service: AnthologiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnthologiesService],
    }).compile();

    service = module.get<AnthologiesService>(AnthologiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
