
 create table user (
    id int primary key AUTO_INCREMENT,
    name varchar(250),
    contactNumber varchar(20),
    email varchar(50),
    password varchar(250),
    status varchar(20),
    role varchar(20),
    UNIQUE (email)
 );

 insert into user (name,contactNumber,email,password,status,role) 
 values('kevin','123123123','kevic100@hotmail.com','123','true','admin');


 create table category(
   id int NOT NULL AUTO_INCREMENT primary key,
   name varchar(255) NOT NULL
 );


 CREATE TABLE product (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  categoryId INTEGER NOT NULL,
  description VARCHAR(255),
  price FLOAT,
  discount FLOAT, -- Nuevo campo para el descuento
  status INT,
  image VARCHAR(255),
  PRIMARY KEY(id)
);

 CREATE TABLE sale (
  id_sale VARCHAR(5) NOT NULL,
  names VARCHAR(255) NOT NULL,
  lastnames VARCHAR(255) NOT NULL,
  typeDocument VARCHAR(3) NOT NULL,
  document int(15),
  email VARCHAR(255),
  contacNumber int(12), -- Nuevo campo para el descuento
  departamento VARCHAR(50),
  provincia VARCHAR(50),
  distrito VARCHAR(50),
  pay varchar(5)
);

CREATE TABLE sale_product (
  id int(10) NOT NULL AUTO_INCREMENT,
  id_sale VARCHAR(5) NOT NULL,
  product VARCHAR(255) NOT NULL,
  count VARCHAR(255) NOT NULL,
  price FLOAT,
  image VARCHAR(255) NOT NULL
);

create table bill(
  id int NOT NULL AUTO_INCREMENT,
  uuid varchar(200) NOT NULL,
  name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  contactNumber varchar(20) NOT NULL,
  paymentMethod varchar(50) NOT NULL,
  total int NOT NULL,
  productDetails JSON DEFAULT NULL,
  createBy varchar(255) NOT NULL,
  primary key (id)
);