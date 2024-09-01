import { EventType } from '@prisma/client';

export class CreateEventDto {
  type: EventType; // The type of the event (VIEW, LIKE, UNLIKE)
  createdById: number; // The ID of the user who created the event
  articleId: number; // The ID of the article associated with the event
}
