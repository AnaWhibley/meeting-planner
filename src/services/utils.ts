import {MockUserService, UserService} from "./userService";

const isDev = true;

export const getUserService = () => {
  return isDev ? MockUserService : UserService;
};
