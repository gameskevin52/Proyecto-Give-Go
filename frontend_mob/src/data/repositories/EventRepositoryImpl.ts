import { Event } from "../../domain/entities/Events";
import { EventRepository } from "../../domain/repositories/EventRepository";
import { EventApi } from "../sources/remote/api/EventApi";

export class EventRepositoryImpl implements EventRepository {
  private api = new EventApi();

  async create(event: Event): Promise<Event> {
    return await this.api.create(event);
  }

  async update(event: Event): Promise<Event> {
    throw new Error("Method not implemented.");
  }

  async delete(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async findById(id: number): Promise<Event | null> {
    throw new Error("Method not implemented.");
  }

  async findAll(): Promise<Event[]> {
    throw new Error("Method not implemented.");
  }
}