import test from 'tape';
import {hash, compare, reset, update} from '../src';

test('hash() errors if no password given', t => {
  try {
    hash({});
  }
  catch(e) {
    t.equal(e.message, 'No password provided', 'Errors when no password is provided');
    t.end();
  }
});

test('hash() produces a salted hash and overrides user password with it', t => {
  const user = {password: 'password'};
  hash(user).then(hash => {
    t.equal(hash.substr(0, 4), '$2a$', 'Hash begins with correct prefix');
    t.equal(user.password, hash, 'User password field is set to hash');
    t.end();
  });
});

test('compare() correctly compares password to salted hash', t => {
  const password = 'password';
  const user = {password};
  hash(user).then(() => compare(user, password)).then(result => {
    t.ok(result, 'User password field equals password hash');
    t.end();
  });
});

test('reset() generates a token and adds to user with expire', t => {
  const user = {};
  const future = Date.now() + 3600000;
  reset(user).then(token => {
    t.equals(token.length, 40, 'Token length is 40 chars');
    t.ok(user.resetPasswordToken, 'User resetPasswordToken field is set');
    t.ok(user.resetPasswordExpires, 'User resetPasswordExpires field is set');
    t.ok(user.resetPasswordExpires >= future, 'User resetPasswordExpires field is set to 3600000 seconds in the future');
    t.end();
  });
});

test('update() sets hash of given password on user and removes previously generated token and expiration values', t => {
  const user = {};
  const password = 'password';
  reset(user).then(() => update(user, password)).then(() => {
    t.notOk(user.resetPasswordToken, 'User resetPasswordToken field is unset');
    t.notOk(user.resetPasswordExpires, 'User resetPasswordExpires field is unset');
    return compare(user, password);
  }).then(result => {
    t.ok(result, 'User password is updated correctly');
    t.end();
  });
});
