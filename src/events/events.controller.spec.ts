import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventType } from '@prisma/client';
import { faker } from '@faker-js/faker';

describe('EventsController', () => {
  let eventsController: EventsController;
  let eventsService: EventsService;
  let prismaService: PrismaService;
  beforeAll(() => {
    prismaService = new PrismaService();
    eventsService = new EventsService(prismaService);
    eventsController = new EventsController(eventsService);
  });

  beforeEach(async () => {
    await prismaService.$executeRaw`TRUNCATE TABLE "Event" RESTART IDENTITY CASCADE`;
  });

  const getRandomEventType = (): EventType => {
    const eventTypes: EventType[] = ['VIEW', 'LIKE', 'UNLIKE'];
    return eventTypes[Math.floor(Math.random() * eventTypes.length)];
  };

  const generateMockEvents = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      type: getRandomEventType(),
      createdById: i + 1,
      articleId: i + 1,
    }));
  };

  describe('findAll', () => {
    it('should return an array of events', async () => {
      const mockEvents = generateMockEvents(5);

      await prismaService.event.createMany({
        data: mockEvents,
      });
      const result = await eventsController.findAll();

      expect(result).toEqual(mockEvents);
    });
  });

  describe('remove', () => {
    it('should remove a event', async () => {
      const mockEvents = generateMockEvents(1);

      await prismaService.event.createMany({
        data: mockEvents,
      });
      const result = await eventsController.remove(1);

      expect(result).toEqual(mockEvents[0]);
      expect(await prismaService.event.findMany()).toEqual([]);
    });
  });

  describe('create', () => {
    it('create a event', async () => {
      const mockEvents = generateMockEvents(1);

      const createdEvent = await eventsController.create(mockEvents[0]);

      expect(createdEvent).toEqual(mockEvents[0]);
      expect(await prismaService.event.findMany()).toEqual(mockEvents);
    });
  });

  describe('update', () => {
    it('should update a event', async () => {
      const mockEvents = generateMockEvents(1);

      await prismaService.event.createMany({
        data: mockEvents,
      });
      if (mockEvents[0].type == EventType.LIKE) {
        mockEvents[0].type = EventType.VIEW;
      } else {
        mockEvents[0].type = EventType.LIKE;
      }
      const result = await eventsController.update(1, mockEvents[0]);

      expect(result).toEqual(mockEvents[0]);
      expect(await prismaService.event.findMany()).toEqual(mockEvents);
    });
  });
});
