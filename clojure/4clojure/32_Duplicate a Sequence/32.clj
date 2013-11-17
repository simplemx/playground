(fn t[l] (
    if (= 1 (count l)) 
    (list (first l) (first l))
    (concat
        (list (first l) (first l))
        (t (rest l))
    )
))
