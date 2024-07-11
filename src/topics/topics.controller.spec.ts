import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TopicsController', () => {
  let topicsController: TopicsController;
  let topicsService: TopicsService;
  let prismaService: PrismaService;
  beforeAll(() => {
    prismaService = new PrismaService();
    topicsService = new TopicsService(prismaService);
    topicsController = new TopicsController(topicsService);
  });

  beforeEach(async () => {
    await prismaService.$executeRaw`TRUNCATE TABLE "Topic" RESTART IDENTITY CASCADE`;
  });

  const generateMockTopics = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      name: `Topic ${i + 1}`,
      id: i + 1,
      description: `Description ${i + 1}`,
      image: `image${i + 1}.png`,
    }));
  };

  describe('findAll', () => {
    it('should return an array of topics', async () => {
      const mockTopics = generateMockTopics(5);

      await prismaService.topic.createMany({
        data: mockTopics,
      });
      const result = await topicsController.findAll();

      expect(result).toEqual(mockTopics);
    });
  });

  describe('remove', () => {
    it('should remove a topic', async () => {
      const mockTopics = generateMockTopics(1);

      await prismaService.topic.createMany({
        data: mockTopics,
      });
      const result = await topicsController.remove(1);

      expect(result).toEqual(mockTopics[0]);
      expect(await prismaService.topic.findMany()).toEqual([]);
    });
  });

  describe('create', () => {
    it('create a topic', async () => {
      const mockTopics = generateMockTopics(1);

      const createdTopic = await topicsController.create(mockTopics[0]);

      expect(createdTopic).toEqual(mockTopics[0]);
      expect(await prismaService.topic.findMany()).toEqual(mockTopics);
    });
  });

  describe('update', () => {
    it('should update a topic', async () => {
      const mockTopics = generateMockTopics(1);

      await prismaService.topic.createMany({
        data: mockTopics,
      });
      mockTopics[0].name = 'updated name';
      const result = await topicsController.update(1, mockTopics[0]);

      expect(result).toEqual(mockTopics[0]);
      expect(await prismaService.topic.findMany()).toEqual(mockTopics);
    });
  });
});
