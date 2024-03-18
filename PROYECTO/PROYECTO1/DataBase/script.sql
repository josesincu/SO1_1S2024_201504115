create database so1proyecto1;

use so1proyecto1;

create table record (
	id int auto_increment primary key,
    ram boolean not null,
    free decimal(5, 2) not null,
    busy decimal(5, 2) not null
);

create table sysprocess(
	pid int primary key,
    name_process varchar(200),
    user_process varchar(200),
    state int,
    ram int,
    father_pid int,
    foreign key (father_pid) references sysprocess(pid)
);

create table state_process(
    state_process int primary key,
    description_process varchar(500)
);

create table historyprocess(
    id int auto_increment primary key,
    pid int,
    state_process int,
    active boolean,
    foreign key (state_process) references state_process(state_process) on delete cascade
);

insert into state_process (state_process, description_process)
values (1, "new"), (2, "running"), (3, "waiting"), (4, "ready"), (5, "terminated");