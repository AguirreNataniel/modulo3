# modulo3
ATENCIÓN



Usuario CRUD:
    get /usuarios
        - Devuelve los usuarios en la tabla usuario
    get /usuarios/:id
        - Devuelve un usuario específico dando el ID
    get /usuarios/promedio-edad
        - Devuelve el promedio de los usuarios de la tabla usuario
    post /usuarios
        - Createa un usuario a partir de los datos requeridos:
        - ci, nombre, primer_apellido, segundo_apellido, nacimiento
        - Devuelve un objeto del usuario creado
    put /usuarios/:id
        - Cambia los valores de un usuarioa partir del ID y pide la toda la información:
        - ci, nombre, primer_apellido, segundo_apellido, nacimiento
        - Devuelve un objeto del usuario cambiado
    delete /usuarios/:id
        - Elimina un usuario a partir del ID



SQL 

create table usuario (
id              serial primary key,
    ci              varchar(10) not null,
    nombre            varchar(30) not null,
    primer_apellido  varchar(30) not null,
    segundo_apellido varchar(30) not null,
    nacimiento           date,
    edad            integer     not null
    )