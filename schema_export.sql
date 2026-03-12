 
 
 
 CREATE TABLE inventory_alert (message character varying(500) NOT NULL);
 
 
 
 
 
 CREATE TABLE product_comparison (name character varying(200) NOT NULL);
 CREATE TABLE product_image (url character varying(500) NOT NULL);
 CREATE TABLE product_review (title character varying(200) NOT NULL);
 CREATE TABLE product_variant (name character varying(100) NOT NULL, sku character varying(50) NOT NULL);
 CREATE TABLE products (category character varying(100) NOT NULL, name character varying(200) NOT NULL);
 
 
 
 
 
 CREATE TABLE reviews (title character varying(100) NOT NULL);
 
 CREATE TABLE supplier (name character varying(200) NOT NULL, code character varying(50) NOT NULL);
 
 
 

