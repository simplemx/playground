(defn t[spliter l] (
    if (= 1 (count l))
    l
    (apply conj (t spliter (rest l)) (reverse (list (first l) spliter)))
))

