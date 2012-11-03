package main

import "fmt"

// fibonacci �����᷵��һ������ int �ĺ�����
func fibonacci() func() int {
	var i = 0
	var j = 1
	return func() int{
		i, j = j, i+ j
		return i
	}
}

func main() {
	f := fibonacci()
	for i := 0; i < 10; i++ {
		fmt.Println(f())
	}
}