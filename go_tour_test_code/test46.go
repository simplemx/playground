package main

import (
	"tour/wc"
	"strings"
)

func WordCount(s string) map[string]int {
	var m = make(map[string]int)
	var arr = strings.Split(s, " ")
	for _, word := range arr{
		if _, ok := m[word];ok{
			m[word]++
		} else {
			m[word]= 1
		}
	}
	return m
}

func main() {
	wc.Test(WordCount)
}