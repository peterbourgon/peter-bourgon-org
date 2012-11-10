package main

import (
	"fmt"
	"math/rand"
	"time"
)

type Runner interface {
	Run(distance int) error
}

type Runbot9000 struct {
	// ...
}

func (b Runbot9000) Run(distance int) error {
	return nil // Runbot 9000 is not programmed to fail
}

type Baby struct{}

func (x Baby) Run(distance int) error {
	return fmt.Errorf("babies can't run")
}

type Developer struct {
	Clumsiness float32 // 0..1
}

func (d Developer) Run(distance int) error {
	if rand.Float32() < d.Clumsiness {
		return fmt.Errorf("tripped over shoelaces")
	}
	return nil
}

func init() {
	rand.Seed(time.Now().UnixNano())
}

func Race(distance int, runners ...Runner) {
	for i, r := range runners {
		err := r.Run(distance)
		if err == nil {
			fmt.Printf("Runner %d finished, hooray!\n", i)
		} else {
			fmt.Printf("Runner %d didn't finish: %s\n", i, err)
		}
	}
}

func main() {
	Race(50, Developer{Clumsiness: 0.5}, Baby{}, Runbot9000{})
}
