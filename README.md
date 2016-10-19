# Node Password Util

[![Build Status](https://travis-ci.org/andy-shea/node-password-util.svg?branch=master)](https://travis-ci.org/andy-shea/node-password-util)
[![Code Coverage](http://codecov.io/github/andy-shea/node-password-util/coverage.svg?branch=master)](http://codecov.io/github/andy-shea/node-password-util?branch=master)

Hash, compare, and reset passwords for your nodejs app

**Requirements:** Node.js 0.10+

## Installation

```
yarn add node-password-util
```

## Usage

To replace a cleartext password with a one-way hash:
```javascript
import {hash} from 'node-password-util';

const user = {
  name: 'Joe Blog',
  password: 'somelonghardtoguesspassword'
};

hash(user).then(() => {
  console.log(user);
  // user = {
  //   name: 'Joe Blog',
  //   password: '$2a$10$Lk1PZU6zlofxzbvCpbBbNunh0lDVHkp.vnB5C0RDPmndWGrTnH8Fq'
  // }
});
```

To verify a password against a user's hash:
```javascript
import {compare} from 'node-password-util';

const user = {
  name: 'Joe Blog',
  password: '$2a$10$Lk1PZU6zlofxzbvCpbBbNunh0lDVHkp.vnB5C0RDPmndWGrTnH8Fq'
};

compare(user, 'somelonghardtoguesspassword').then(isMatch => {
  console.log(isMatch);
  // true
});
```

To generate a reset password token with expiry:
```javascript
import {reset} from 'node-password-util';

const user = {
  name: 'Joe Blog',
  password: '$2a$10$Lk1PZU6zlofxzbvCpbBbNunh0lDVHkp.vnB5C0RDPmndWGrTnH8Fq'
};

reset(user).then(() => {
  console.log(user);
  // user = {
  //   name: 'Joe Blog',
  //   password: '$2a$10$Lk1PZU6zlofxzbvCpbBbNunh0lDVHkp.vnB5C0RDPmndWGrTnH8Fq',
  //   resetPasswordToken: '80a1b278254d476895d340bf54bfd5a0da2635a7',
  //   resetPasswordExpires: 1476881237903 (expires in an hour)
  // }
});
```

To update a user's password:
```javascript
import {update} from 'node-password-util';

const user = {
  name: 'Joe Blog',
  password: '$2a$10$Lk1PZU6zlofxzbvCpbBbNunh0lDVHkp.vnB5C0RDPmndWGrTnH8Fq',
  resetPasswordToken: '80a1b278254d476895d340bf54bfd5a0da2635a7',
  resetPasswordExpires: 1476881237903
};

update(user, 'someothernewreallylongpassword').then(() => {
  console.log(user);
  // user = {
  //   name: 'Joe Blog',
  //   password: '$2a$10$eiEx4/zisb59vSq9sZbbPeR5cYzYgPcEbDDO6719LPEjCwkvN6g0C'
  // }
});
```
## Licence

[MIT](./LICENSE)
