import {MockUserService, UserService} from "./userService";

const isDev = false;

export const getUserService = () => {
  return isDev ? MockUserService : UserService;
};
