package main

import (
	"context"
	"fmt"
	pb "grpcServer/server"
	"log"
	"net"

	"google.golang.org/grpc"

	_ "github.com/go-sql-driver/mysql"
)

type server struct {
	pb.UnimplementedGetInfoServer
}

const (
	port = ":3001"
)

type Data struct {
	Name  string
	Album string
	Year  string
	Rank  string
}

func (s *server) ReturnInfo(ctx context.Context, in *pb.RequestId) (*pb.ReplyInfo, error) {
	fmt.Println("Recibí de cliente: ", in.GetName())
	data := Data{
		Name:  in.GetName(),
		Album: in.GetAlbum(),
		Year:  in.GetYear(),
		Rank:  in.GetRank(),
	}
	fmt.Println(data)
	// insertRedis(data)
	/**
	*	CONEXION BASES DE DATOS
	 */
	//conexionMySql(data.Name, data.Album, data.Year, data.Rank)
	return &pb.ReplyInfo{Info: "Hola cliente, recibí el album"}, nil
}

func main() {

	fmt.Println("Servicor corriento")
	fmt.Println("Puerto:", port)

	listen, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalln(err)
	}
	s := grpc.NewServer()
	pb.RegisterGetInfoServer(s, &server{})

	// redisConnect()

	if err := s.Serve(listen); err != nil {
		log.Fatalln(err)
	}
}
