Start project
-----------------------------------
```
npm install
```

```
docker pull mysql
```

Dev mode
_________________________________________
```
nodemon --inspect-brk=3030 ./bin/www
```

```
docker run --name mysql --network host -v /home/super-coder/mysql-volume:/var/lib/mysql \
-e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=store_db -e MYSQL_USER=store_user -e MYSQL_PASSWORD=store_password_111 \
-d mysql:latest
```

```
ALTER USER ? IDENTIFIED WITH mysql_native_password BY '?';
```

```
docker run --network host --name redis -d redis
```
Prod mode
________________________________________
```

```