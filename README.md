Code Example
_________________________________________
- Move .env_example to .env
- Start Mysql server
```
docker run --name mysql --network host -v ~/mysql-volume:/var/lib/mysql \
-e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=store_db -e MYSQL_USER=store_user -e MYSQL_PASSWORD=store_password_111 \
-d mysql:latest
```

```
ALTER USER ? IDENTIFIED WITH mysql_native_password BY '?';
```

```
docker run --network host --name redis -d redis
```
- Build app docker
```
docker build -t app_test
```
- Run app image
```
docker run -d --name app --network host --env-file ./.env -v $(pwd):/app app_test
```