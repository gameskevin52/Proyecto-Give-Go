import { AxiosError } from "axios";
import { User } from "../../domain/entities/User";
import { AuthRepository } from "../../domain/repositories/AuthRepository";
import { ApiDelivery } from "../sources/remote/api/ApiDelivery";
import { ResponseApiDelivery } from "../sources/remote/models/ResponseApiDelivery";

export class AuthRepositoryImpl implements AuthRepository {
  async register(user: User): Promise<ResponseApiDelivery> {
    try {
      const response = await ApiDelivery.post<ResponseApiDelivery>('/users/create', user);
      return Promise.resolve(response.data);
    } catch (error) {
      const e = error as AxiosError;
      console.log('Error AuthRepository register: ', e.response?.data);
      const apiError: ResponseApiDelivery = (e.response?.data as ResponseApiDelivery) || {
        success: false,
        message: 'Error al conectar con el servidor de Give&Go.'
      };
      return Promise.resolve(apiError);
    }
  }

  async login(email: string, password: string): Promise<ResponseApiDelivery> {
    try {
      const response = await ApiDelivery.post<ResponseApiDelivery>('/users/login', {
        email: email,
        correo: email,
        password: password,
      });
      return Promise.resolve(response.data);
    } catch (error) {
      const e = error as AxiosError;
      console.log('Error AuthRepository login: ', e.response?.data);
      const apiError: ResponseApiDelivery = (e.response?.data as ResponseApiDelivery) || {
        success: false,
        message: 'Credenciales inválidas o error de conexión.'
      };
      return Promise.resolve(apiError);
    }
  }
}
