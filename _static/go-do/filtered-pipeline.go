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
	toFilter := make(chan Msg) // HL
	toEnricher := make(chan Msg)
	toStore := make(chan Msg)

	go Listen(toFilter)             // HL
	go Filter(toFilter, toEnricher) // HL
	go Enrich(toEnricher, toStore)
	go Store(toStore)

	time.Sleep(1 * time.Second)
}
