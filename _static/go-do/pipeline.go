package main

import (
	"flag"
	"fmt"
	"math/rand"
	"time"
)

var (
	mode = flag.String("mode", "simple", "mode: simple, filtered, scaled, http")
)

func init() {
	rand.Seed(time.Now().UnixNano())
	flag.Parse()
}

type Msg string

func Listen(out chan Msg) {
	for {
		// simulate a stream of messages
		time.Sleep(time.Duration(rand.Intn(250)) * time.Millisecond)
		if rand.Intn(10) < 6 {
			out <- "foo"
		} else {
			out <- "bar"
		}
	}
}

func Filter(in, out chan Msg) {
	for {
		msg := <-in
		if msg == "bar" {
			continue // drop
		}
		out <- msg
	}
}

func Enrich(in, out chan Msg) {
	for {
		msg := <-in
		msg = "☆" + msg + "☆"
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
	switch *mode {
	default:
		// begin-simple OMIT
		// build the infrastructure
		toEnricher := make(chan Msg)
		toStore := make(chan Msg)

		// launch the actors
		go Listen(toEnricher)
		go Enrich(toEnricher, toStore)
		go Store(toStore)

		time.Sleep(1 * time.Second)
		// end-simple OMIT

	case "filtered":
		// begin-filtered OMIT
		toFilter := make(chan Msg)
		toEnricher := make(chan Msg)
		toStore := make(chan Msg)

		go Listen(toFilter)
		go Filter(toFilter, toEnricher)
		go Enrich(toEnricher, toStore)
		go Store(toStore)

		time.Sleep(1 * time.Second)
		// end-filtered OMIT

	case "scaled":
		// begin-scaled OMIT
		toFilter := make(chan Msg)
		toEnricher := make(chan Msg)
		toStore := make(chan Msg)

		go Listen(toFilter)
		go Filter(toFilter, toEnricher)
		go Enrich(toEnricher, toStore)
		go Enrich(toEnricher, toStore)
		go Enrich(toEnricher, toStore)
		go Store(toStore)

		time.Sleep(1 * time.Second)
		// end-scaled OMIT
	}
}
