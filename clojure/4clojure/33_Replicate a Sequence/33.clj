(defn t [l n] (
    
    if (= 1 (count l))
    (repeat n (first l))
    (
        apply conj (t (rest l) n)  (repeat n (first l))
    )        
    
))

