package main

import "fmt"

func main() {
	var s1 string = "Jón Þór Birgisson" // Variables may be explicitly typed,
	s2 := "Jónsi"                       // or implicitly typed.

	fmt.Printf("%s, or '%s' for short\n", s1, s2)
}
