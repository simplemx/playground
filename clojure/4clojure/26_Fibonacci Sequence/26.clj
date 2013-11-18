(defn t[n] (
    if (= n 1)
    [1]
    (if (= n 2)
        [1 1]
        (
            let [sl (reverse (t (- n 1)))]
            (
            conj (t (- n 1)) (+ (first sl) (first (rest sl)))
            )
        )
    )
))
