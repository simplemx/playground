package main

import "tour/pic"

func Pic(dx, dy int) [][]uint8 {
	var s = make([][]uint8, dy)
	for i := 0 ; i < dy; i++ {
		s[i] = make([]uint8, dx)
	}
	return s
}

func main() {
	pic.Show(Pic)
}