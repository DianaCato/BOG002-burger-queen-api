CREATE DATABASE IF NOT EXISTS bq;

USE bq;

--USERS TABLE
CREATE TABLE users (
    id INT(11) NOT NULL AUTO_INCREMENT,
    username VARCHAR(16) NOT NULL,
    password VARCHAR(60) NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

DESCRIBE users;

-- PRODUCTS TABLES
CREATE TABLE products (
  id_product int(11) NOT NULL AUTO_INCREMENT,
  name varchar(45) NOT NULL,
  price int(11) NOT NULL,
  image varchar(45) NOT NULL,
  type varchar(45) NOT NULL,
  dateEntry date NOT NULL,
  PRIMARY KEY (id_product)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Table for register products'