(
defn t[l] (
    let [rl (reverse l)
        len (
            if (= 1 (rem (count l) 2))
            (/ (- (count l) 1) 2)
            (/ (count l) 2)
        )
    ]
    (
    if (= (type l) (type "test"))
    (= (vec l) rl)
    (= l rl))    
)
)
