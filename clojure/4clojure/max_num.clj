(defn t[l] (
    if (= 1 (count l))
    (first l)
    (
    if (>= (first l) (t (rest l)))
    (first l)
    (t (rest l))
    )
))
