create table usuario (
	id serial default,
    ci              varchar(10) not null,
    nombre            varchar(30) not null,
    primer_apellido  varchar(30) not null,
    segundo_apellido varchar(30) not null,
    nacimiento           date,
    edad            integer     not null
    )