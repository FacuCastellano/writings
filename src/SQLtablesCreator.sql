-- creo la tabla (users) de usuarios.
create table users(
	username varchar(255) not null,
    lastname varchar(255),
    firstname varchar(255),
    email varchar(255),
    pass varchar(255),
    primary key (username)
);

-- creo la tabla (writings) de escritos.
create table writings(
	id varchar(255) not null,
    text_number int,
    title varchar(255),
	texto text,
    author varchar(255),
    public_state bool,
    stage_name varchar(255),
    date_written datetime,
	primary key (id),
    foreign key (author) references users(username)
);
