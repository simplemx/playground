(fn [l] (filter (fn [x] (if (= 1 x) true (= 1 (rem x 2)))) l))
