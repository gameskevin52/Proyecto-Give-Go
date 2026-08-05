// no borrar 
import { Event } from "../entities/Events";

export interface EventRepository {
  create(event: Event): Promise<Event>;

  update(event: Event): Promise<Event>;

  delete(id: number): Promise<void>;

  findById(id: number): Promise<Event | null>;

  findAll(): Promise<Event[]>;
}