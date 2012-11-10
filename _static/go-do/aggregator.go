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

// begin-backend OMIT

type Backend interface {
	Query(q string) string
}

// end-backend OMIT

// begin-skrillex OMIT

type Skrillex struct{}

func (s Skrillex) Query(q string) string {
	time.Sleep(time.Duration(rand.Intn(100)) * time.Millisecond)
	return "wub-wub-wub"
}

// end-skrillex OMIT

// begin-mybackend OMIT

type MyBackend string

func (b MyBackend) Query(q string) string {
	time.Sleep(time.Duration(rand.Intn(100)) * time.Millisecond)
	return fmt.Sprintf("%s/%s", b, q)
}

// end-mybackend OMIT

// begin-queryall-sync OMIT

func QueryAll(q string, backends ...Backend) []string {
	results := []string{}
	for _, backend := range backends {
		r := backend.Query(q)
		results = append(results, r)
	}
	return results
}

// end-queryall-sync OMIT

// begin-queryall-async OMIT

func QueryAllAsync(q string, backends ...Backend) []string {
	// query
	c := make(chan string, len(backends)) // buffered chan
	for _, backend := range backends {
		go func(b Backend) { c <- b.Query(q) }(backend) // ☜
	}

	// aggregate
	results := []string{}
	for i := 0; i < cap(c); i++ {
		results = append(results, <-c)
	}
	return results
}

// end-queryall-async OMIT

// begin-replicas OMIT

type Replicas []Backend // Backends with same content

func (r Replicas) QueryAllTakeFirst(q string) string {
	c := make(chan string, len(r))
	for _, backend := range r {
		go func(b Backend) { c <- b.Query(q) }(backend)
	}
	return <-c // what happens to the other goroutines?
}

// end-replicas OMIT

// begin-queryall-replicas OMIT

func QueryAllReplicas(q string, replicas ...Replicas) []string {
	// query
	c := make(chan string, len(replicas))
	for _, r := range replicas {
		go func(r Replicas) { c <- r.QueryAllTakeFirst(q) }(r)
	}

	// aggregate
	results := []string{}
	for i := 0; i < cap(c); i++ {
		results = append(results, <-c)
	}
	return results
}

// end-queryall-replicas OMIT

func main() {
	// begin-backends OMIT
	b1 := MyBackend("server-1")
	b2 := MyBackend("server-2")
	b3 := Skrillex{}
	// end-backends OMIT

	switch *method {
	case "replicas":
		// begin-query-replicas OMIT
		r1 := Replicas{MyBackend("s1.1"), MyBackend("s1.2")}
		r2 := Replicas{MyBackend("s2.1"), MyBackend("s2.2"), MyBackend("s2.3")}
		r3 := Replicas{Skrillex{}, Skrillex{}, Skrillex{}}

		began := time.Now()
		results := QueryAllReplicas("dubstep", r1, r2, r3)
		fmt.Println(results)
		fmt.Println(time.Since(began))
		// end-query-replicas OMIT

	case "async":
		// begin-query-async OMIT
		began := time.Now()
		results := QueryAllAsync("dubstep", b1, b2, b3)
		fmt.Println(results)
		fmt.Println(time.Since(began))
		// end-query-async OMIT

	default:
		// begin-query-sync OMIT
		began := time.Now()
		results := QueryAll("dubstep", b1, b2, b3)
		fmt.Println(results)
		fmt.Println(time.Since(began))
		// end-query-sync OMIT
	}
}
