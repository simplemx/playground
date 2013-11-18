(defn t [str] (
    let [l (vec str) caps (vec "ABCDEFGHIJKLMNOPQRSTUVWXYZ")
    ]
    (str (map char (filter (
            fn [x] (
                > (count (filter (fn [y] (= x y)) caps)) 0
            )
        ) l))
    )
))
