# Next.js SaaS + RBAC

This project contains all the necessary boilerplate to setup a multi-tenant SaaS with Next.js including authentication and RBAC authorization.

## 📌 Features

### Authentication

- [X] It should be able to authenticate using e-mail & password;
- [X] It should be able to authenticate using Github account;
- [X] It should be able to recover password using e-mail;
- [X] It should be able to create an account (e-mail, name and password);

### Organizations

- [X] It should be able to create a new organization;
- [X] It should be able to get organizations to which the user belongs;
- [X] It should be able to update an organization;
- [X] It should be able to shutdown an organization;
- [X] It should be able to transfer organization ownership;

### Invites

- [X] It should be able to invite a new member (e-mail, role);
- [X] It should be able to accept an invite;
- [X] It should be able to revoke a pending invite;

### Members

- [X] It should be able to get organization members;
- [X] It should be able to update a member role;


## 🛡️ RBAC

Roles & permissions.

### Roles

- Owner (count as administrator)
- Administrator
- Member
- Billing (one per organization)
- Anonymous

### Permissions table

|                          | Administrator | Member | Billing | Anonymous |
| ------------------------ | ------------- | ------ | ------- | --------- |
| Update organization      | ✅            | ❌     | ❌      | ❌        |
| Delete organization      | ✅            | ❌     | ❌      | ❌        |
| Invite a member          | ✅            | ❌     | ❌      | ❌        |
| Revoke an invite         | ✅            | ❌     | ❌      | ❌        |
| List members             | ✅            | ✅     | ✅      | ❌        |
| Transfer ownership       | ⚠️            | ❌     | ❌      | ❌        |
| Update member role       | ✅            | ❌     | ❌      | ❌        |
| Delete member            | ✅            | ⚠️     | ❌      | ❌        |

> ✅ = allowed
> ❌ = not allowed
> ⚠️ = allowed w/ conditions
#### Conditions

- Only owners may transfer organization ownership;
- Only administrators and project authors may update/delete the project;
- Members can leave their own organization;


## 🚀 Technologies

This project was developed with the following technologies:

- Typescript
- Node
- Fastify
- Casl
- Swagger
- Prisma
- PostgreSQL
- Docker
- Turborepo

## 🖲️ Getting Started
```sh
 - npm install
 - npm run dev
```

## Documentation

http://localhost:3333/docs




## 📝 License

This project is under MIT license.