# Pizza App

This is an api for a blog app

---

<!-- ## Requirements
1. User should be able to register
2. User should be able to login with Passport using JWT
3. Implement basic auth
4. User should be able to get orders
5. Users should be able to create orders
6. Users should be able to update and delete orders
7. Test application -->

---

## Setup

- Install NodeJS, mongodb
- pull this repo
- update env with example.env
- run `npm run start:dev`

---

## Base URL

<!-- - somehostsite.com -->

## Models

---

### User

| field     | data_type | constraints |
| --------- | --------- | ----------- |
| firstName | string    | required    |
| lastName  | string    | required    |
| email     | string    | required    |
| passWord  | string    | required    |
| blogs     | objectId  | optional    |

### Order

| field                                        | data_type | constraints |
| -------------------------------------------- | --------- | ----------- |
| state                                        | string    | required    |
| default: draft, enum: ['draft', 'published'] |
| title                                        | string    | required    |
| description                                  | string    | optional    |
| readCount                                    | number    | default:0   |
| readingTime                                  | number    | optional    |
| body                                         | string    | required    |

## APIs

---

### Signup User

- Route: /signup
- Method: POST
- Body:

```
{
  "email": "doe@example.com",
  "passWord": "Password1",
  "firstName": "jon",
  "lastName": "doe",
}
```

- Responses

Success

```
{
    message: 'Signup successful',
    user: {
        "email": "doe@example.com",
        "password": "Password1",
        "firstname": "jon",
        "lastname": "doe",
        "username": 'jon_doe",
    }
}
```

---

### Login User

- Route: /login
- Method: POST
- Body:

```
{
  "password": "Password1",
  "email: 'andrew1@gmail.com",
}
```

- Responses

Success

```
{
    message: 'Login successful',
    token: 'sjlkafjkldsfjsd'
}
```

---

### Create Post

- Route: /blogs
- Method: POST
- Header
  - Authorization: Bearer {token}
- Body:

```
{
    items: [{ name: 'chicken pizza', price: 900, size: 'm', quantity: 1}]
}
```

- Responses

Success

```
{
    state: 1,
    total_price: 900,
    created_at: Mon Oct 31 2022 08:35:00 GMT+0100,
    items: [{ name: 'chicken pizza', price: 900, size: 'm', quantity: 1}]
}
```

---

### Get Blog

- Route: /orders/:id
- Method: GET
- Header
  - Authorization: Bearer {token}
- Responses

Success

```
{
    state: 1,
    total_price: 900,
    created_at: Mon Oct 31 2022 08:35:00 GMT+0100,
    items: [{ name: 'chicken pizza', price: 900, size: 'm', quantity: 1}]
}
```

---

### Get Blogs

- Route: /blogs
- Method: GET
- Header:
  - Authorization: Bearer {token}
- Query params:
  - page (default: 1)
  - per_page (default: 10)
  - order_by (default: created_at)
  - order (options: asc | desc, default: desc)
  - state
  - created_at
- Responses

Success

```
{
    state: 1,
    total_price: 900,
    created_at: Mon Oct 31 2022 08:35:00 GMT+0100,
    items: [{ name: 'chicken pizza', price: 900, size: 'm', quantity: 1}]
}
```

---

...

## Contributor

- Nonso Andrew
