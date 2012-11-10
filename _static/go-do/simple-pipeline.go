package main

import (
	"fmt"
	"math/rand"
	"time"
)

func init() {
	rand.Seed(time.Now().UnixNano())
}

type Msg string

func Listen(out chan Msg) {
	for {
		time.Sleep(time.Duration(rand.Intn(250)) * time.Millisecond)
		if rand.Intn(10) < 6 {
			out <- "foo"
		} else {
			out <- "bar"
		}
	}
}

func Enrich(in, out chan Msg) {
	for {
		msg := <-in
		msg = "☆ " + msg + " ☆"
		out <- msg
	}
}

func Store(in chan Msg) {
	for {
		msg := <-in
		fmt.Println(msg) // mock storage
	}
}

func main() {
	// build the infrastructure
	toEnricher := make(chan Msg)
	toStore := make(chan Msg)

	// launch the actors
	go Listen(toEnricher)
	go Enrich(toEnricher, toStore)
	go Store(toStore)

	time.Sleep(1 * time.Second)
}
