<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio

```
git clone https://github.com/Comparitiko/nest-pokedex.git
```

2. Ejecutar

```
pnpm install
```

3. Tener Nest CLI instalado

```
npm i -g @nestjs/cli
```

4. Levantar la base de datos

```
docker-compose up
```

5. Clonar el archivo **.env.template** y renombrarlo a _.env_

6. Rellenar los datos en el archivo _.env_

7. Ejecutar la aplicación en desarrollo

```
pnpm run start:dev
```

7. Seed de datos

```
http://localhost:3000/api/v2/seed
```

# Build de producción

1. Crear el archivo ```.env.prod'''
2. Rellenar los datos en el archivo _.env.prod_
3. Crear la imagen de Docker

```
docker compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```

## Stack usado

- MongoDB
- NestJS
- TypeScript
