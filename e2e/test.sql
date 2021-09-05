CREATE DATABASE IF NOT EXISTS test;

USE test;

CREATE TABLE users (
    _id INT(11) NOT NULL AUTO_INCREMENT,
    email VARCHAR(30) NOT NULL,
    password VARCHAR(60) NOT NULL,
    isAdmin TINYINT NULL DEFAULT 0,
    PRIMARY KEY (_id)
);

CREATE TABLE products (
  id_product int(11) NOT NULL AUTO_INCREMENT,
  name varchar(45) NOT NULL,
  price double NOT NULL,
  imagen longtext,
  type varchar(45) DEFAULT NULL,
  dateEntry date NOT NULL,
  PRIMARY KEY (id_product)
);

CREATE TABLE orders (
  _id INT NOT NULL AUTO_INCREMENT,
  userId INT NOT NULL,
  client VARCHAR(45) NOT NULL,
  products longtext NOT NULL,
  status VARCHAR(45) NOT NULL,
  dateEntry DATE NOT NULL,
  dateProcessed DATE DEFAULT NULL,
  PRIMARY KEY (_id),
  INDEX userId_idx (userId ASC),
  CONSTRAINT userId
    FOREIGN KEY (userId)
    REFERENCES test.users (_id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
