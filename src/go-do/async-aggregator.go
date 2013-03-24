package main

import (
	"flag"
	"fmt"
	"math/rand"
	"time"
)

func init() {
	flag.Parse()
	rand.Seed(time.Now().UnixNano())
}

type Backend interface {
	Query(q string) string
}

type Skrillex struct{}

func (s Skrillex) Query(q string) string {
	time.Sleep(time.Duration(rand.Intn(100)) * time.Millisecond)
	return "wub-wub-wub"
}

type MyBackend string

func (b MyBackend) Query(q string) string {
	time.Sleep(time.Duration(rand.Intn(100)) * time.Millisecond)
	return fmt.Sprintf("%s/%s", b, q)
}

func QueryAll(q string, backends ...Backend) []string {
	// query
	c := make(chan string, len(backends)) // buffered chan
	for _, backend := range backends {
		go func(b Backend) { c <- b.Query(q) }(backend) // HL
	}

	// aggregate
	results := []string{}
	for i := 0; i < cap(c); i++ {
		results = append(results, <-c)
	}
	return results
}

func main() {
	b1 := MyBackend("server-1")
	b2 := MyBackend("server-2")
	b3 := Skrillex{}

	began := time.Now()
	results := QueryAll("dubstep", b1, b2, b3)
	fmt.Println(results)
	fmt.Println(time.Since(began))
}
