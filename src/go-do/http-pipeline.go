package main

import (
	"fmt"
	"net/http" // production-grade HTTP server
)

type Msg struct {
	Data string    // 'data' parameter extracted from form values
	Done chan bool // signal channel to request handler
}

func Listen(out chan *Msg) {
	h := func(w http.ResponseWriter, r *http.Request) {
		msg := &Msg{
			Data: r.FormValue("data"),
			Done: make(chan bool),
		}
		out <- msg

		success := <-msg.Done // wait for done signal
		if !success {
			w.Write([]byte(fmt.Sprintf("aborted: %s", msg.Data)))
			return
		}
		w.Write([]byte(fmt.Sprintf("OK: %s", msg.Data)))
	}

	http.HandleFunc("/incoming", h)
	fmt.Println("listening on :8080")
	http.ListenAndServe(":8080", nil) // blocks
}

func Filter(in, out chan *Msg) {
	for {
		msg := <-in
		if msg.Data == "bar" {
			msg.Done <- false // HL
			continue
		}
		out <- msg
	}
}

func Enrich(in, out chan *Msg) {
	for {
		msg := <-in
		msg.Data = "☆ " + msg.Data + " ☆"
		out <- msg
	}
}

func Store(in chan *Msg) {
	for {
		msg := <-in
		fmt.Println(msg.Data)
		msg.Done <- true // HL
	}
}

func main() {
	toFilter := make(chan *Msg)
	toEnricher := make(chan *Msg)
	toStore := make(chan *Msg)

	go Listen(toFilter)
	go Filter(toFilter, toEnricher)
	go Enrich(toEnricher, toStore)
	go Store(toStore)

	select {} // block forever without spinning the CPU
}
