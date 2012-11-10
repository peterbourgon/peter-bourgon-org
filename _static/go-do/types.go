package main

import "fmt"

type Thing struct {
	Name  string
	Value int
}

type Celsius float32
type Fahrenheit float32

func main() {
	c := Celsius(0)
	f := Fahrenheit(32)

	if c == f { // compiler error
		fmt.Println("It's cold!")
	}
}
