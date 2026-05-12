import jwt, { SignOptions } from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  role?: string;
  [key: string]: any;
}

interface GenerateTokenArgs {
  payload: JwtPayload;
  expiresIn?: string | number;
  secret?: string;
}

export const generateToken = ({
  payload,
  expiresIn = '15m',
  secret = process.env.JWT_SECRET as string,
}: GenerateTokenArgs): string => {
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: '7d',
  } as SignOptions);
};

export const verifyToken = (token: string, secret: string = process.env.JWT_SECRET as string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as JwtPayload;
};