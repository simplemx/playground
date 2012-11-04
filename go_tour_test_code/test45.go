package main

import (
	"fmt"
	"math"
)
var z = 1.0

func Sqrt(x float64) float64 {
	for i := 0 ; i < 10 ; i++ {
		t := z * z - x
		z = z - t / (2* z)
	}
	return z
}

func main() {
	fmt.Println(Sqrt(2))
	fmt.Println(math.Sqrt(2))
}