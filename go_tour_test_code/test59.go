package main

import (
	"fmt"
)
type ErrNegativeSqrt float64

func (e ErrNegativeSqrt) Error() string {
	return fmt.Sprint("cannot Sqrt negative number: %v" , float64(e))
}

var z = 1.0

func Sqrt(f float64) (float64, error) {
	if f < 0 {
		return 0, ErrNegativeSqrt(f)
	}
	for i := 0 ; i < 10 ; i++ {
		t := z * z - f
		z = z - t / (2* z)
	}
	return z, nil
}

func main() {
	fmt.Println(Sqrt(2))
	fmt.Println(Sqrt(-2))
}