import prisma from '../../prisma/client.js';
import { AppError } from '../../utils/AppError.js';
import { hashPassword, comparePassword } from '../../utils/security/hash.js';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../../utils/security/jwt.js';

export const register = async (userData: any) => {
  const { name, email, password } = userData;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new AppError('User already exists', 400);

  const hashedPassword = await hashPassword(password);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const login = async (loginData: any) => {
  const { email, password } = loginData;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await comparePassword(password, user.password))) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive) throw new AppError('Account deactivated', 403);

  // Generate tokens
  const payload = { userId: user.id, role: user.role };
  const accessToken = generateToken({ payload });
  const refreshToken = generateRefreshToken(payload);

  // Hash and store refresh token
  const hashedRefreshToken = await hashPassword(refreshToken);
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: hashedRefreshToken },
  });

  const { password: _, refreshToken: __, ...userWithoutSecrets } = user;
  return { user: userWithoutSecrets, accessToken, refreshToken };
};

export const refreshAccessToken = async (token: string) => {
  try {
    const decoded = verifyRefreshToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user || !user.refreshToken || !(await comparePassword(token, user.refreshToken))) {
      throw new AppError('Invalid refresh token', 401);
    }

    const accessToken = generateToken({ payload: { userId: user.id, role: user.role } });
    return { accessToken };
  } catch (error) {
    throw new AppError('Refresh token expired or invalid', 401);
  }
};

export const logout = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });
};
