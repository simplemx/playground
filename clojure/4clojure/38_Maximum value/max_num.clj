(defn t[& k] (
    let [l (flatten (list k))]
    (
    if (= 1 (count l))
    (first l)
    (
    if (>= (first l) (t (rest l)))
    (first l)
    (t (rest l))
    )
)
))
