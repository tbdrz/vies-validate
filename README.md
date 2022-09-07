# Getting started

## Installation

```
npm install vies-validate
```

## Usage

```ts
import { validate } from "vies-validate";

const { data, error } = await validate("NL", "853746333B01");
```

When valid:

```ts
data: {
  countryCode: 'xx',
  vatNumber: 'xxxxxxxxx',
  requestDate: '2013-11-22+01:00',
  valid: true,
  name: 'company name',
  address: 'company address'
}
error: null
```

When invalid:

```ts
data: {
  countryCode: 'xx',
  vatNumber: 'xxxxxxxxxx',
  requestDate: '2013-11-22+01:00',
  valid: false,
  name: '---',
  address: '---'
}
error: null
```

When error

```ts
data: null;
error: "INVALID_INPUT";
```

# License

The MIT License (MIT)
