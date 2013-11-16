(fn t[l] 
	(filter (
		fn [x] (
			let [sl  (range 2 (+ 1 (/ x 2))) ]
			(if (empty? sl) true
			(if (empty? 
				(filter (
					fn [v] (= (type (/ x v)) (type 1))
					)
					sl)
				) true nil
			)
)
		) ) l
))
