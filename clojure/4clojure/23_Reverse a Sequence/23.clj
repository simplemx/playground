(fn t[l] (
        if (empty? l) 
        l
        (flatten (
                list 
                (t (rest l)) 
                (first l)   
         )
        ) 
    )
)

