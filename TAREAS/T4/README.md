# TAREA 4

## LINK VIDEO:
### https://drive.google.com/drive/folders/1QDCxwddRMQUVSay_upM8kG0xbAAhziMj?usp=sharing
## HERRAMIENTAS
*   Locust.
*   Mackaroo.
*   Golang.
*   Cloud Sql.

## INSTALAR LOCUST
```py
pip3 install locust
```

## EJECUCION LOCUST
```py
locust -f name_file.py
```

## INSTALR COMPILARDOR DE PROTO
```
sudo apt install protobuf-compiler
```
## Compilar archivo .proto cliente y servidor
```bash
protoc --go_out=. --go-grpc_out=. client.proto

protoc --go_out=. --go-grpc_out=. server.proto
```

## DEPENDECIAS DE CLIENTE Y SERVIDOR GOLANG
```bash
go get github.com/gofiber/fiber/v2

go get google.golang.org/grpc

go install google.golang.org/protobuf/cmd/protoc-gen-go@latest

go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

go get -u github.com/go-sql-driver/mysql
```
