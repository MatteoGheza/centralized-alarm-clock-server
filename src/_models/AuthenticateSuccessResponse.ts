import { User } from '../entity/User';

export interface AuthenticateSuccessResponse {
    access_token: string;
    user: User;
}