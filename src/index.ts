import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SALT_WORK_FACTOR = 10;

export interface Authenticatable {
  password?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
}

export function hash(user: Authenticatable) {
  const password = user.password;
  if (!password) throw new Error('No password provided');
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(SALT_WORK_FACTOR, function(error: Error, salt) {
      if (error) return reject(error);
      bcrypt.hash(password, salt, function(error: Error, hash: string) {
        if (error) return reject(error);
        user.password = hash;
        resolve(hash);
      });
    });
  });
}

export function compare(user: Authenticatable, password: string) {
  const userPassword = user.password;
  if (!userPassword) throw new Error('No password provided');
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, userPassword, function(error: Error, result: boolean) {
      if (error) return reject(error);
      resolve(result);
    });
  });
}

export function reset(user: Authenticatable) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(20, (error: Error | null, buffer: Buffer) => {
      if (error) return reject(error);
      const token = buffer.toString('hex');
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000;
      resolve(token);
    });
  });
}

export async function update(user: Authenticatable, password: string) {
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await hash(user);
  return user;
}

export default {hash, compare, reset, update};
