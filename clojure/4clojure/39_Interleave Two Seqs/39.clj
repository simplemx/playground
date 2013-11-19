(defn t[a b] (
    if (= 0 (count a))
    '()
    (if (= 0 (count b))
    '()
    (
        cons (first a) (
        cons (first b)
        (t (rest a) (rest b))
        ) 
    )
    )
))
