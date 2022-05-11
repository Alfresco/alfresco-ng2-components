import { Constructor } from '../interface';
export abstract class ApiClientFactory {
  abstract create<T>(apiClass: Constructor<T>): T;
}
