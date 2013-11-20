(defn t[x] (
	let [l (if (= (type "test") (type x))
    (vec x)
    x)]
          (
    if (= 1 (count l))
    l
    (if (= (first l) (first (rest l))) 
    (t (rest l))
    (cons (first l) (t (rest l))) )
         )))

