(defn v [s] (

apply str ( (fn [s] (
    let [l (vec s) caps (vec "ABCDEFGHIJKLMNOPQRSTUVWXYZ")
    ]
    (filter (
            fn [x] (
                > (count (filter (fn [y] (= x y)) caps)) 0
            )
        ) l)
    
)) s))

)
