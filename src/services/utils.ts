import {MockUserService, UserService} from "./userService";
import {EventService, MockEventService} from './eventService';

const isDev = false;

export const getUserService = () => {
  return isDev ? MockUserService : UserService;
};

export const getEventService = () => {
  return isDev ? MockEventService : EventService;
};

export interface ServiceResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}