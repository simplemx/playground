(defn t[l] (
        if (= 1 (count l)) 
        l
        (
                concat 
                (t (rest l)) 
                (list (first l))   
        ) 
    )
)

