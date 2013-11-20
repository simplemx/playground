(defn t[x] (
	let [l (if (= (type "test") (type x))
    (vec x)
    x)]
          (
    if (= 1 (count l))
    l
    (if (> (count (filter (fn[v] (= v (first l))) (rest l))) 0) 
    (t (rest l))
    (cons (first l) (t (rest l))) )
         )))

