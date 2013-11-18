(defn t[begin end](
    if (= begin (- end 1))
    (list begin)
    (cons begin (t (+ begin 1) end))
))
