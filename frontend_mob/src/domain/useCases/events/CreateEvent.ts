// no borrar 
import { Event } from "../../entities/Events";
import { EventRepository } from "../../repositories/EventRepository";

export class CreateEvent {
  constructor(private repository: EventRepository) {}

  async execute(event: Event): Promise<Event> {
    return await this.repository.create(event);
  }
}