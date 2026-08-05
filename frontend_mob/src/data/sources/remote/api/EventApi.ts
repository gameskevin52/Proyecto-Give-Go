import axios from "axios";
import { Event } from "../../../../domain/entities/Event";

const api = axios.create({
  baseURL: "http://TU_IP:3000", // Cambia TU_IP por la de tu computador
});

export class EventApi {
  async create(event: Event): Promise<Event> {
    const response = await api.post(
      "/fundaciones/eventos",
      event
    );

    return response.data.data;
  }
}