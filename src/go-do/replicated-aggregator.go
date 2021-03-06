package main

import (
	"flag"
	"fmt"
	"math/rand"
	"time"
)

var (
	method = flag.String("method", "sync", "which query method to use")
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

type Replicas []Backend // Backends with same content

func (r Replicas) Query(q string) string { // HL
	c := make(chan string, len(r))
	for _, backend := range r {
		go func(b Backend) { c <- b.Query(q) }(backend)
	}
	return <-c // HL
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
	r1 := Replicas{MyBackend("foo1"), MyBackend("foo2"), MyBackend("foo3")}
	r2 := Replicas{MyBackend("bar1"), MyBackend("bar2")}
	r3 := Replicas{Skrillex{}, Skrillex{}, Skrillex{}, Skrillex{}, Skrillex{}}

	began := time.Now()
	results := QueryAll("dubstep", r1, r2, r3)
	fmt.Println(results)
	fmt.Println(time.Since(began))
}
