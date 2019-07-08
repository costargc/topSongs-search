# Top Songs Search NODE app#

This is a simple use of an AWS RDS database with MYSQL in node.

![Screenshot](images/search-song_gif.gif)

* In order to use this you should create a .env file with your database details:

```js
MYSQL_SB_PW = "password"
MYSQL_SB_HOST = "rds-db-project.code.location.rds.amazonaws.com"
MYSQL_SB_USER = "username"
```

* Please note that your database must have the structure proposed in database_structure > schema.sql. And you need to import the data present in source_data > TopSongs.csv