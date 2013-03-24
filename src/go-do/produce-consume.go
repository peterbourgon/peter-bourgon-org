package main

import "fmt"

func main() {
	c := make(chan int)
	go produce(c)
	consume(c) // HL
}

func produce(c chan int) {
	c <- 1 // put data onto channel
	c <- 2
	c <- 3
	close(c)
}

func consume(c chan int) {
	for i := range c {
		fmt.Println(i)
	}
}
