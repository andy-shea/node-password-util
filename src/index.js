import Promise from 'bluebird';

const bcrypt = Promise.promisifyAll(require('bcryptjs'));
const crypto = Promise.promisifyAll(require('crypto'));
const SALT_WORK_FACTOR = 10;

export function hash(user) {
  if (!user.password) throw new Error('No password provided');
  return bcrypt
      .genSaltAsync(SALT_WORK_FACTOR)
      .then(salt => bcrypt.hashAsync(user.password, salt))
      .then(hash => user.password = hash);
}

export function compare(user, password) {
  return bcrypt.compareAsync(password, user.password);
}

export function reset(user) {
  return crypto.randomBytesAsync(20).then(buffer => {
    const token = buffer.toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;
    return token;
  });
}

export function update(user, password) {
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  return hash(user).then(() => user);
}

export default {hash, compare, reset, update};
