FROM golang:alpine
WORKDIR /usr/src/proyecto2/go
COPY . .
RUN go build -o goservice

CMD ["./goservice"]

# docker build -t animedark/so1_client_producer .
# docker push animedark/so1_client_producer . 